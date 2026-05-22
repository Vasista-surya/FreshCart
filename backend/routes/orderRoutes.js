const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes are protected
router.use(protect);

// ─── POST /api/orders/apply-coupon ──────────────────────────────────────────
// Validate coupon and calculate discount (must be before /:id route)
router.post('/apply-coupon', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and subtotal',
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive coupon code',
      });
    }

    // Check expiry
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired',
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // flat discount
      discount = coupon.discountValue;
    }

    discount = Math.round(discount * 100) / 100;

    res.json({
      success: true,
      discount,
      couponCode: coupon.code,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/orders ───────────────────────────────────────────────────────
// Create a new order
router.post('/', async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, items, couponCode, notes } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a shipping address',
      });
    }

    let orderItems = [];

    if (items && items.length > 0) {
      // Use items from request body
      orderItems = items;
    } else {
      // Use items from user's cart
      const cart = await Cart.findOne({ user: req.user._id }).populate(
        'items.product',
        'name price image unit weight'
      );

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items to order. Add items to your cart or provide items in the request.',
        });
      }

      orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        unit: item.product.unit,
        weight: item.product.weight,
      }));
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Tax: 5%
    const tax = Math.round(subtotal * 0.05 * 100) / 100;

    // Delivery charge: free if subtotal >= 500, else ₹40
    const deliveryCharge = subtotal >= 500 ? 0 : 40;

    // Apply coupon discount
    let discount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        const isExpired = coupon.expiresAt && coupon.expiresAt < new Date();
        const isOverLimit = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        const meetsMinimum = subtotal >= coupon.minOrderAmount;

        if (!isExpired && !isOverLimit && meetsMinimum) {
          if (coupon.discountType === 'percentage') {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
          discount = Math.round(discount * 100) / 100;
          appliedCouponCode = coupon.code;

          // Increment usage count
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    // Total
    const totalAmount = Math.round((subtotal + tax + deliveryCharge - discount) * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      subtotal,
      tax,
      deliveryCharge,
      discount,
      couponCode: appliedCouponCode,
      totalAmount,
      notes,
    });

    // Clear the user's cart after placing the order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/orders ────────────────────────────────────────────────────────
// Get user's orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/orders/:id ───────────────────────────────────────────────────
// Get specific order
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify the order belongs to the user or user is admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
