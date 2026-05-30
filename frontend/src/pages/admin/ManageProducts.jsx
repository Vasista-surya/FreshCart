import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi'
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const emptyProduct = { name: '', category: '', price: '', mrp: '', stock: '', description: '', image: '', weight: '', brand: '' }
const categories = ['Grocery', 'Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Personal Care', 'Household']

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const { addToast } = useToast()

  const fetchProducts = async () => {
    try {
      const res = await getAdminProducts()
      setProducts(res.data.products || [])
    } catch { }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setShowModal(true) }
  const openEdit = (p) => { setEditing(p._id); setForm({ ...emptyProduct, ...p, price: String(p.price), mrp: String(p.mrp || ''), stock: String(p.stock) }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { ...form, price: Number(form.price), mrp: Number(form.mrp) || Number(form.price), stock: Number(form.stock) }
    try {
      if (editing) {
        await updateProduct(editing, data)
        addToast('Product updated', 'success')
      } else {
        await createProduct(data)
        addToast('Product created', 'success')
      }
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      addToast('Product deleted', 'info')
      fetchProducts()
    } catch {
      addToast('Failed to delete', 'error')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-semibold text-xl">Manage Products</h2>
        <button onClick={openCreate} className="btn-primary !text-sm gap-1" id="admin-add-product"><HiPlus className="w-4 h-4" /> Add Product</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Stock</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{p.category}</td>
                    <td className="py-3 px-4 text-right font-medium">₹{p.price}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`badge ${p.stock > 0 ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><HiPencil className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/40 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-display font-semibold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><HiX className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required className="input-field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} required className="input-field">
                      <option value="">Select</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Brand</label><input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} className="input-field" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Price (₹)</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1">MRP (₹)</label><input type="number" value={form.mrp} onChange={e => setForm(f => ({...f, mrp: e.target.value}))} className="input-field" /></div>
                  <div><label className="block text-sm font-medium mb-1">Stock</label><input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} required className="input-field" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Weight</label><input value={form.weight} onChange={e => setForm(f => ({...f, weight: e.target.value}))} placeholder="e.g. 1kg, 500ml" className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} required className="input-field" /></div>
                <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required rows={3} className="input-field resize-none" /></div>
                <button type="submit" className="btn-primary w-full">{editing ? 'Update Product' : 'Create Product'}</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
