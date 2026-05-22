const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  image: {
    type: String,
  },
  icon: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  productCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const mongooseModel = mongoose.model('Category', categorySchema);
const { createMockableModel } = require('../config/mockDb');
module.exports = createMockableModel('Category', mongooseModel);
