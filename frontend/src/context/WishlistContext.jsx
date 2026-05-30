import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'
import * as api from '../services/api'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    if (user) fetchWishlist()
    else setItems([])
  }, [user])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const res = await api.getWishlist()
      setItems(res.data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = useCallback(async (productId) => {
    if (!user) {
      addToast('Please login to add to wishlist', 'error')
      return
    }
    try {
      const res = await api.addToWishlist(productId)
      setItems(res.data.items || [])
      addToast('Added to wishlist ❤️', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add to wishlist', 'error')
    }
  }, [user, addToast])

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      const res = await api.removeFromWishlist(productId)
      setItems(res.data.items || [])
      addToast('Removed from wishlist', 'info')
    } catch {
      addToast('Failed to remove from wishlist', 'error')
    }
  }, [addToast])

  const isInWishlist = useCallback((productId) => {
    return items.some(i => (i.product?._id || i.productId || i) === productId)
  }, [items])

  return (
    <WishlistContext.Provider value={{ items, loading, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}
