const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: [true, 'Please specify discount type'],
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add a discount value'],
    min: [0, 'Discount value cannot be negative'],
  },
  minOrderAmount: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageLimit: {
    type: Number,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mongooseModel = mongoose.model('Coupon', couponSchema);
const { createMockableModel } = require('../config/mockDb');
module.exports = createMockableModel('Coupon', mongooseModel);
