const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

// ─── GET /api/wishlist ──────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name price mrp image category brand unit weight stock isAvailable'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/wishlist ─────────────────────────────────────────────────────
// Add product to wishlist
router.post('/', async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId',
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      // Don't add duplicates
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (!alreadyExists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    // Return populated wishlist
    wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name price mrp image category brand unit weight stock isAvailable'
    );

    res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/wishlist/:productId ────────────────────────────────────────
// Remove product from wishlist
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    // Return populated wishlist
    const updatedWishlist = await Wishlist.findOne({
      user: req.user._id,
    }).populate(
      'products',
      'name price mrp image category brand unit weight stock isAvailable'
    );

    res.json({
      success: true,
      wishlist: updatedWishlist,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
