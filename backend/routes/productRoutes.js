const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');

const router = express.Router();

// ─── GET /api/products ──────────────────────────────────────────────────────
// List products with filtering, sorting, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isAvailable: true };

    // Search by name (case-insensitive regex)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Filter by category (smart slug-to-name mapping)
    if (category) {
      const normalizedCategory = String(category).toLowerCase().trim();
      
      if (normalizedCategory === 'grocery' || normalizedCategory === 'groceries' || normalizedCategory === 'grocery-staples' || normalizedCategory === 'grocery-and-staples') {
        filter.category = {
          $in: [
            'Rice & Grains',
            'Atta & Flour',
            'Pulses & Dal',
            'Cooking Oils',
            'Spices & Masala',
            'Salt & Sugar',
            'Tea & Coffee',
            'Biscuits & Cookies',
            'Bread & Bakery'
          ]
        };
      } else if (normalizedCategory === 'fruits' || normalizedCategory === 'vegetables' || normalizedCategory === 'fruits-vegetables' || normalizedCategory === 'fruits-&-vegetables') {
        filter.category = 'Fruits & Vegetables';
      } else if (normalizedCategory === 'dairy' || normalizedCategory === 'dairy-products' || normalizedCategory === 'dairy-eggs') {
        filter.category = 'Dairy Products';
      } else if (normalizedCategory === 'snacks' || normalizedCategory === 'snacks-namkeen') {
        filter.category = 'Snacks & Namkeen';
      } else if (normalizedCategory === 'beverages') {
        filter.category = 'Beverages';
      } else if (normalizedCategory === 'personal-care') {
        filter.category = 'Personal Care';
      } else if (normalizedCategory === 'household' || normalizedCategory === 'cleaning-household' || normalizedCategory === 'cleaning-&-household') {
        filter.category = 'Cleaning & Household';
      } else if (normalizedCategory === 'snacks-beverages') {
        filter.category = { $in: ['Snacks & Namkeen', 'Beverages'] };
      } else {
        // Dynamic category lookup fallback
        const categoryDoc = await Category.findOne({
          $or: [
            { slug: normalizedCategory },
            { name: { $regex: '^' + normalizedCategory + '$', $options: 'i' } }
          ]
        });
        
        if (categoryDoc) {
          filter.category = categoryDoc.name;
        } else {
          // Fallback exact/regex match
          filter.category = { $regex: '^' + category + '$', $options: 'i' };
        }
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1, rating: -1 };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, count] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      page: pageNum,
      pages: Math.ceil(count / limitNum),
      total: count,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/products/featured ─────────────────────────────────────────────
router.get('/featured', async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isAvailable: true,
    }).limit(8);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/products/search?q=term ────────────────────────────────────────
router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isAvailable: true,
    }).limit(10);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/products/:id ──────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find related products (same category, exclude current)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isAvailable: true,
    }).limit(4);

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
