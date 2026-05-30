import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'
import * as api from '../services/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      // Load from localStorage for guests
      const saved = localStorage.getItem('cart')
      if (saved) {
        try { setItems(JSON.parse(saved)) } catch { setItems([]) }
      }
    }
  }, [user])

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await api.getCart()
      setItems(res.data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addItem = useCallback(async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await api.addToCart(product._id, quantity)
        setItems(res.data.items || [])
        addToast(`${product.name} added to cart`, 'success')
        setIsCartOpen(true)
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to add item', 'error')
      }
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.product?._id === product._id || i.productId === product._id)
        if (existing) {
          return prev.map(i =>
            (i.product?._id === product._id || i.productId === product._id)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        }
        return [...prev, { product, productId: product._id, quantity }]
      })
      addToast(`${product.name} added to cart`, 'success')
      setIsCartOpen(true)
    }
  }, [user, addToast])

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId)
    if (user) {
      try {
        const res = await api.updateCartItem(productId, quantity)
        setItems(res.data.items || [])
      } catch (err) {
        addToast('Failed to update quantity', 'error')
      }
    } else {
      setItems(prev =>
        prev.map(i =>
          (i.product?._id === productId || i.productId === productId)
            ? { ...i, quantity }
            : i
        )
      )
    }
  }, [user, addToast])

  const removeItem = useCallback(async (productId) => {
    if (user) {
      try {
        const res = await api.removeCartItem(productId)
        setItems(res.data.items || [])
        addToast('Item removed from cart', 'info')
      } catch (err) {
        addToast('Failed to remove item', 'error')
      }
    } else {
      setItems(prev => prev.filter(i => i.product?._id !== productId && i.productId !== productId))
      addToast('Item removed from cart', 'info')
    }
  }, [user, addToast])

  const clearAll = useCallback(async () => {
    if (user) {
      try {
        await api.clearCart()
        setItems([])
      } catch {
        addToast('Failed to clear cart', 'error')
      }
    } else {
      setItems([])
      localStorage.removeItem('cart')
    }
  }, [user, addToast])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => {
    const price = i.product?.price || 0
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      items, loading, itemCount, subtotal,
      isCartOpen, setIsCartOpen,
      addItem, updateQuantity, removeItem, clearAll, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
