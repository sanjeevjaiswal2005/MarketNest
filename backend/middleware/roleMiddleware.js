// Role-based authorization middleware

// Require specific role(s)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

// Require brand role
const requireBrand = (req, res, next) => {
  return requireRole('brand')(req, res, next);
};

// Require customer role
const requireCustomer = (req, res, next) => {
  return requireRole('customer')(req, res, next);
};

// Check product ownership
const checkOwnership = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is the owner
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this product'
      });
    }

    req.product = product;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  requireRole,
  requireBrand,
  requireCustomer,
  checkOwnership
};

