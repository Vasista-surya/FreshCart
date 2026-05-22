const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mongooseModel = mongoose.model('Wishlist', wishlistSchema);
const { createMockableModel } = require('../config/mockDb');
module.exports = createMockableModel('Wishlist', mongooseModel);
