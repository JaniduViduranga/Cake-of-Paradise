import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate signed JWT token expiring in 7 days
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'cake_of_paradise_super_secret_jwt_key_2026_secure';
  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

// Helper to sanitize user object
const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  fullName: user.fullName,
  name: user.fullName, // backward compatibility with frontend components expecting user.name
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  addresses: user.addresses || [],
  orders: user.orders || [],
  activeOrder: user.activeOrder || null,
  createdAt: user.createdAt,
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function registerUser(req, res) {
  try {
    const { fullName, name, email, phone, password } = req.body;
    const resolvedName = (fullName || name || '').trim();
    const resolvedEmail = (email || '').toLowerCase().trim();

    // 1. Validation
    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required.',
      });
    }

    if (!resolvedEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: resolvedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // 3. Create user document
    const user = await User.create({
      fullName: resolvedName,
      email: resolvedEmail,
      phone: (phone || '').trim(),
      password,
      role: 'user',
    });

    // 4. Generate signed JWT token
    const token = generateToken(user);

    // 5. Respond with 201 Created and sanitized user
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
}

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const resolvedEmail = (email || '').toLowerCase().trim();

    // 1. Validate input presence
    if (!resolvedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Look up user by email
    const user = await User.findOne({ email: resolvedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Generate JWT
    const token = generateToken(user);

    // 5. Respond with 200 OK
    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
}

/**
 * @desc    Get current logged in user session details
 * @route   GET /api/auth/me
 * @access  Private (Protected by authMiddleware)
 */
export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User session not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user session.',
    });
  }
}
