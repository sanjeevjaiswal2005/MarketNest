const User = require('../models/User');

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    // Check if user is updating their own profile
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get brand profile (for customers to view)
// @route   GET /api/users/brand/:id
// @access  Public
exports.getBrandProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name avatar createdAt');
    
    if (!user || user.role !== 'brand') {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Get product count
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ brand: req.params.id });

    res.json({
      success: true,
      data: {
        brand: {
          id: user._id,
          name: user.name,
          avatar: user.avatar,
          memberSince: user.createdAt,
          productCount
        }
      }
    });
  } catch (error) {
    console.error('Get brand profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

