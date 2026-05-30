import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineSearch, HiX } from 'react-icons/hi'
import { searchProducts } from '../../services/api'

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()
  const navigate = useNavigate()
  const debounceRef = useRef()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchProducts(query)
        setResults(res.data.products?.slice(0, 6) || [])
      } catch {
        setResults([])
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  const handleSelect = (product) => {
    navigate(`/product/${product._id}`)
    onClose?.()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      onClose?.()
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for groceries, fruits, vegetables..."
          className="input-field !pl-12 !pr-10"
          id="search-input"
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
            <HiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </form>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.map(product => (
            <button
              key={product._id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
              </div>
              <span className="text-sm font-semibold text-brand-600">₹{product.price}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
