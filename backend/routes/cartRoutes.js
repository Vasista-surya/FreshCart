const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes are protected
router.use(protect);

/**
 * Helper: Populate and return the user's cart
 */
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name price image stock unit weight isAvailable'
  );
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findOne({ user: userId }).populate(
      'items.product',
      'name price image stock unit weight isAvailable'
    );
  }
  return cart;
};

// ─── GET /api/cart ──────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const cart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/cart ─────────────────────────────────────────────────────────
// Add item to cart
router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

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

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/cart/:productId ───────────────────────────────────────────────
// Update quantity for a product in cart
router.put('/:productId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/cart/:productId ────────────────────────────────────────────
// Remove a specific product from cart
router.delete('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);

    res.json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/cart ────────────────────────────────────────────────────────
// Clear entire cart — must be defined with a different path trick
// since DELETE / conflicts with DELETE /:productId
// We use a special "clear" route
router.delete('/', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: cart || { user: req.user._id, items: [] },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
