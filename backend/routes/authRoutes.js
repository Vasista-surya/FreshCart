const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ─── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req, res, next) => {
  console.log('📩 Received signup payload in backend /api/auth/register:', req.body);
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.warn('⚠️ Signup validation failed: name, email or password missing');
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    if (password.length < 6) {
      console.warn('⚠️ Signup validation failed: password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.warn(`⚠️ Signup failed: User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    console.log('🌱 Creating user in database...');
    const user = await User.create({ name, email, password, phone });
    console.log('✅ User created successfully in database:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('💥 Backend registration error caught:', error);
    next(error);
  }
});

// ─── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  console.log('📩 Received login request:', req.body ? { email: req.body.email } : 'empty body');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.warn('⚠️ Login validation failed: email or password missing');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.warn(`⚠️ Login failed: user with email ${email} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.warn(`⚠️ Login failed: incorrect password for email ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log(`🔑 Login successful for user: ${user.email} (${user._id})`);
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('💥 Backend login error caught:', error);
    next(error);
  }
});

// ─── GET /api/auth/profile ──────────────────────────────────────────────────
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/auth/profile ──────────────────────────────────────────────────
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/auth/address ──────────────────────────────────────────────────
router.put('/address', protect, async (req, res, next) => {
  try {
    const { name, phone, street, city, state, pincode, isDefault, addressId } = req.body;

    if (!name || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all address fields',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If isDefault is true, set all existing addresses to non-default
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If addressId is provided, update existing address
    if (addressId) {
      const existingAddr = user.addresses.id(addressId);
      if (existingAddr) {
        existingAddr.name = name;
        existingAddr.phone = phone;
        existingAddr.street = street;
        existingAddr.city = city;
        existingAddr.state = state;
        existingAddr.pincode = pincode;
        existingAddr.isDefault = isDefault || false;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Address not found',
        });
      }
    } else {
      // Add new address
      user.addresses.push({
        name,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      });
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      addresses: updatedUser.addresses,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
