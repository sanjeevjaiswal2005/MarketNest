const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin only - can be extended)
exports.createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      slug,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Seed initial categories
// @route   POST /api/categories/seed
// @access  Public (for initial setup)
exports.seedCategories = async (req, res) => {
  try {
    const categories = [
      { name: 'Dresses', slug: 'dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
      { name: 'Tops', slug: 'tops', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400' },
      { name: 'Pants', slug: 'pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' },
      { name: 'Skirts', slug: 'skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj?w=400' },
      { name: 'Jackets', slug: 'jackets', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' },
      { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400' },
      { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400' },
      { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=400' }
    ];

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Categories already seeded',
        data: { count: existingCount }
      });
    }

    await Category.insertMany(categories);

    res.status(201).json({
      success: true,
      message: 'Categories seeded successfully',
      data: { count: categories.length }
    });
  } catch (error) {
    console.error('Seed categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

