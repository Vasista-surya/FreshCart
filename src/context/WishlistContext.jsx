import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import * as api from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

const getLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
  } catch {
    return [];
  }
};

const setLocalWishlist = (items) => {
  localStorage.setItem('wishlist', JSON.stringify(items));
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          const { data } = await api.getWishlist();
          setItems(data.wishlist?.products || data.wishlist || data.items || data || []);
        } else {
          setItems(getLocalWishlist());
        }
      } catch {
        setItems(getLocalWishlist());
      }
      setLoading(false);
    };
    loadWishlist();
  }, [isAuthenticated, user]);

  const addToWishlist = useCallback(
    async (product) => {
      const productId = product._id || product;
      const alreadyExists = items.some(
        (item) => (item._id || item.product?._id || item) === productId
      );
      if (alreadyExists) {
        showToast('Already in wishlist', 'info');
        return;
      }
      try {
        if (isAuthenticated) {
          await api.addToWishlist(productId);
          const { data } = await api.getWishlist();
          setItems(data.wishlist?.products || data.wishlist || data.items || data || []);
        } else {
          setItems((prev) => {
            const updated = [...prev, product];
            setLocalWishlist(updated);
            return updated;
          });
        }
        showToast('Added to wishlist!', 'success');
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to add to wishlist', 'error');
      }
    },
    [isAuthenticated, items, showToast]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      try {
        if (isAuthenticated) {
          await api.removeFromWishlist(productId);
          const { data } = await api.getWishlist();
          setItems(data.wishlist?.products || data.wishlist || data.items || data || []);
        } else {
          setItems((prev) => {
            const updated = prev.filter(
              (item) => (item._id || item.product?._id || item) !== productId
            );
            setLocalWishlist(updated);
            return updated;
          });
        }
        showToast('Removed from wishlist', 'info');
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to remove from wishlist', 'error');
      }
    },
    [isAuthenticated, showToast]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return items.some(
        (item) => (item._id || item.product?._id || item) === productId
      );
    },
    [items]
  );

  const itemCount = useMemo(() => items.length, [items]);

  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    itemCount,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
};
