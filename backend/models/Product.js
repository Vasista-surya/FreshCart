const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  mrp: {
    type: Number,
    min: [0, 'MRP cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Please add a product image'],
  },
  images: [{ type: String }],
  stock: {
    type: Number,
    default: 100,
    min: [0, 'Stock cannot be negative'],
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'L', 'ml', 'pack', 'pcs', 'box'],
  },
  weight: {
    type: String,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  tags: [{ type: String }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

const mongooseModel = mongoose.model('Product', productSchema);
const { createMockableModel } = require('../config/mockDb');
module.exports = createMockableModel('Product', mongooseModel);
