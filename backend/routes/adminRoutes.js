const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, admin);

// ─── GET /api/admin/dashboard ───────────────────────────────────────────────
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      revenueResult,
      recentOrders,
      pendingCount,
      confirmedCount,
      packedCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email'),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Confirmed' }),
      Order.countDocuments({ orderStatus: 'Packed' }),
      Order.countDocuments({ orderStatus: 'Shipped' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      Product.find().sort({ numReviews: -1 }).limit(5),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      orderStatusCounts: {
        pending: pendingCount,
        confirmed: confirmedCount,
        packed: packedCount,
        shipped: shippedCount,
        delivered: deliveredCount,
        cancelled: cancelledCount,
      },
      topProducts,
    });
  } catch (error) {
    next(error);
  }
});

// ─── PRODUCTS MANAGEMENT ────────────────────────────────────────────────────

// GET /api/admin/products — List all products with pagination and search
router.get('/products', async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products — Create a new product
router.post('/products', async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      mrp,
      category,
      subCategory,
      image,
      images,
      stock,
      unit,
      weight,
      brand,
      isAvailable,
      isFeatured,
      tags,
    } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, category and image',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      mrp,
      category,
      subCategory,
      image,
      images,
      stock,
      unit,
      weight,
      brand,
      isAvailable,
      isFeatured,
      tags,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id — Update a product
router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id — Delete a product
router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ─── ORDERS MANAGEMENT ─────────────────────────────────────────────────────

// GET /api/admin/orders — List all orders with pagination and status filter
router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email phone'),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/orders/:id/status — Update order status
router.put('/orders/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status',
      });
    }

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Packed',
      'Shipped',
      'Delivered',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = status;

    // If delivered, set deliveredAt and mark payment as Paid
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Paid';
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
});

// ─── USERS MANAGEMENT ──────────────────────────────────────────────────────

// GET /api/admin/users — List all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// ─── CATEGORIES MANAGEMENT ─────────────────────────────────────────────────

// POST /api/admin/categories — Create category
router.post('/categories', async (req, res, next) => {
  try {
    const { name, image, icon, description, productCount, isActive, order } =
      req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    // Auto-generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const category = await Category.create({
      name,
      slug,
      image,
      icon,
      description,
      productCount,
      isActive,
      order,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id — Update category
router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // If name is being updated, regenerate slug
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/categories/:id — Delete category
router.delete('/categories/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    next(error);
  }
});

// ─── COUPONS MANAGEMENT ────────────────────────────────────────────────────

// POST /api/admin/coupons — Create coupon
router.post('/coupons', async (req, res, next) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      isActive,
      usageLimit,
      expiresAt,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide code, discountType, and discountValue',
      });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      isActive,
      usageLimit,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/coupons — List all coupons
router.get('/coupons', async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/coupons/:id — Delete coupon
router.delete('/coupons/:id', async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Coupon deleted',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
