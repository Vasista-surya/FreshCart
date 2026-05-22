const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');

const router = express.Router();

// ─── GET /api/categories ────────────────────────────────────────────────────
// Get all active categories sorted by order
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/categories/:slug ──────────────────────────────────────────────
// Get category by slug and its products with pagination
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ category: category.name, isAvailable: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ category: category.name, isAvailable: true }),
    ]);

    res.json({
      success: true,
      category,
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
