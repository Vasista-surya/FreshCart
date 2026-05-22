import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const setLocalCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Fetch cart on mount or auth change
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // Merge local cart with server cart on login
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            for (const item of localItems) {
              try {
                await api.addToCart(item.product?._id || item.productId, item.quantity);
              } catch {
                // ignore merge errors
              }
            }
            localStorage.removeItem('cart');
          }
          const { data } = await api.getCart();
          setItems(data.items || data.cart?.items || []);
        } else {
          setItems(getLocalCart());
        }
      } catch {
        setItems(getLocalCart());
      }
      setLoading(false);
    };
    loadCart();
  }, [isAuthenticated, user]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      try {
        if (isAuthenticated) {
          await api.addToCart(product._id, quantity);
          const { data } = await api.getCart();
          setItems(data.items || data.cart?.items || []);
        } else {
          setItems((prev) => {
            const existing = prev.find(
              (item) => (item.product?._id || item.productId) === product._id
            );
            let updated;
            if (existing) {
              updated = prev.map((item) =>
                (item.product?._id || item.productId) === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              );
            } else {
              updated = [...prev, { product, productId: product._id, quantity }];
            }
            setLocalCart(updated);
            return updated;
          });
        }
        showToast('Added to cart!', 'success');
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to add to cart', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      try {
        if (isAuthenticated) {
          await api.removeCartItem(productId);
          const { data } = await api.getCart();
          setItems(data.items || data.cart?.items || []);
        } else {
          setItems((prev) => {
            const updated = prev.filter(
              (item) => (item.product?._id || item.productId) !== productId
            );
            setLocalCart(updated);
            return updated;
          });
        }
        showToast('Removed from cart', 'info');
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to remove item', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (quantity < 1) return removeFromCart(productId);
      try {
        if (isAuthenticated) {
          await api.updateCartItem(productId, quantity);
          const { data } = await api.getCart();
          setItems(data.items || data.cart?.items || []);
        } else {
          setItems((prev) => {
            const updated = prev.map((item) =>
              (item.product?._id || item.productId) === productId
                ? { ...item, quantity }
                : item
            );
            setLocalCart(updated);
            return updated;
          });
        }
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to update quantity', 'error');
      }
    },
    [isAuthenticated, removeFromCart, showToast]
  );

  const clearCartItems = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await api.clearCart();
      }
      setItems([]);
      localStorage.removeItem('cart');
      setCoupon(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to clear cart', 'error');
    }
  }, [isAuthenticated, showToast]);

  const getItemProduct = (item) => item.product || item;

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const prod = getItemProduct(item);
        return sum + (prod.price || 0) * (item.quantity || 0);
      }, 0),
    [items]
  );

  const tax = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal]);
  const deliveryCharge = useMemo(() => (subtotal >= 500 ? 0 : 40), [subtotal]);

  // applyCouponCode MUST be after subtotal is defined
  const applyCouponCode = useCallback(
    async (code) => {
      try {
        const { data } = await api.applyCoupon(code, subtotal);
        setCoupon(data.coupon || data);
        showToast('Coupon applied successfully!', 'success');
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Invalid coupon code';
        showToast(message, 'error');
        return { success: false, message };
      }
    },
    [showToast, subtotal]
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  }, [showToast]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      const d = (subtotal * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(d, coupon.maxDiscount) : d;
    }
    return coupon.discountValue || 0;
  }, [coupon, subtotal]);

  const total = useMemo(
    () => Math.max(0, Math.round((subtotal + tax + deliveryCharge - discount) * 100) / 100),
    [subtotal, tax, deliveryCharge, discount]
  );

  // Expose a function to get item qty by productId
  const getItemQuantity = useCallback(
    (productId) => {
      const item = items.find(
        (i) => (i.product?._id || i.productId) === productId
      );
      return item ? item.quantity : 0;
    },
    [items]
  );

  const value = {
    items,
    loading,
    coupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: clearCartItems,
    applyCoupon: applyCouponCode,
    removeCoupon,
    getItemQuantity,
    itemCount,
    subtotal,
    tax,
    deliveryCharge,
    discount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
