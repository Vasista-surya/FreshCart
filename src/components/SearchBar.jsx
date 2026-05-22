import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchProducts } from '../services/api';

const SearchBar = ({ onClose, isMobile = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  const doSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchProducts(searchQuery);
      const products = data.products || data || [];
      setResults(products.slice(0, 6));
      setIsOpen(true);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      if (onClose) onClose();
    }
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (product) => {
    navigate(`/product/${product._id}`);
    setIsOpen(false);
    setQuery('');
    if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
      <div className="relative">
        <FiSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for groceries, fruits, snacks..."
          className="w-full pl-9 pr-9 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white border border-transparent focus:border-brand-primary/30 transition-all"
          autoFocus={isMobile}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[400px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-400">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">
              No results found
            </div>
          ) : (
            <>
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleResultClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <img
                    src={product.image || product.images?.[0] || 'https://via.placeholder.com/48'}
                    alt={product.name}
                    className="w-10 h-10 object-contain rounded-lg bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.weight} {product.unit}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-brand-primary flex-shrink-0">
                    ₹{product.price}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(query.trim())}`);
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="w-full py-3 text-center text-sm font-medium text-brand-primary hover:bg-brand-primary/5 transition-colors"
              >
                View all results →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
