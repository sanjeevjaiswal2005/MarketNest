const Product = require("../models/Product");
const { validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");

// @desc    Get all products (with filters, search, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      status = "published",
      page = 1,
      limit = 12,
      sort = "-createdAt",
      brand,
    } = req.query;

    // Build query
    let query = {};

    // Only show published products to customers
    if (status) {
      query.status = status;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const products = await Product.find(query)
      .populate("brand", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "brand",
      "name avatar",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Brand only)
exports.createProduct = async (req, res) => {
  try {
    // Check if request is multipart/form-data (with file upload)
    const isMultipart =
      req.headers["content-type"] &&
      req.headers["content-type"].includes("multipart/form-data");

    let name, description, category, price, images, status;

    if (isMultipart && req.files && req.files.length > 0) {
      // Handle multipart form data with file uploads
      name = req.body.name;
      description = req.body.description;
      category = req.body.category;
      price = req.body.price;
      status = req.body.status;
      // Get uploaded image URLs from Cloudinary
      images = req.files.map((file) => file.path);
    } else {
      // Handle regular JSON request
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      ({ name, description, category, price, images, status } = req.body);
    }

    // Validate required fields
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, and price are required",
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price: parseFloat(price),
      images: images || [],
      status: status || "draft",
      brand: req.user._id,
    });

    // Populate brand info
    await product.populate("brand", "name avatar");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner only)
exports.updateProduct = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    const { name, description, category, price, images, status } = req.body;

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (images) updateData.images = images;
    if (status) updateData.status = status;

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("brand", "name avatar");

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete (soft delete/archive) product
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Soft delete - set status to archived
    product.status = "archived";
    await product.save();

    res.json({
      success: true,
      message: "Product archived successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Upload product images
// @route   POST /api/products/upload
// @access  Private (Brand only)
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    // Get the URLs of uploaded images
    const imageUrls = req.files.map((file) => file.path);

    res.json({
      success: true,
      message: "Images uploaded successfully",
      data: { images: imageUrls },
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during image upload",
    });
  }
};

// @desc    Get brand's products (for dashboard)
// @route   GET /api/products/brand/my-products
// @access  Private (Brand only)
exports.getMyProducts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query for brand's products
    let query = { brand: req.user._id };

    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get products
    const products = await Product.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    // Get counts for dashboard
    const totalProducts = await Product.countDocuments({ brand: req.user._id });
    const publishedCount = await Product.countDocuments({
      brand: req.user._id,
      status: "published",
    });
    const archivedCount = await Product.countDocuments({
      brand: req.user._id,
      status: "archived",
    });
    const draftCount = await Product.countDocuments({
      brand: req.user._id,
      status: "draft",
    });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        stats: {
          total: totalProducts,
          published: publishedCount,
          archived: archivedCount,
          draft: draftCount,
        },
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Publish product
// @route   PUT /api/products/:id/publish
// @access  Private (Owner only)
exports.publishProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to publish this product",
      });
    }

    product.status = "published";
    await product.save();

    res.json({
      success: true,
      message: "Product published successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Publish product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Save as draft
// @route   PUT /api/products/:id/draft
// @access  Private (Owner only)
exports.saveAsDraft = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (product.brand.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this product",
      });
    }

    product.status = "draft";
    await product.save();

    res.json({
      success: true,
      message: "Product saved as draft",
      data: { product },
    });
  } catch (error) {
    console.error("Save as draft error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
