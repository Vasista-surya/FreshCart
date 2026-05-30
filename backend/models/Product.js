const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  weight: { type: String },
  brand: { type: String },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 4.0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', brand: 'text' })

module.exports = mongoose.model('Product', productSchema)
