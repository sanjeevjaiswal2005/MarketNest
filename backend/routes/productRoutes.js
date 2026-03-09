const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  getMyProducts,
  publishProduct,
  saveAsDraft,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const {
  requireBrand,
  checkOwnership,
} = require("../middleware/roleMiddleware");
const { uploadMultiple } = require("../utils/cloudinary");

// Validation rules
const productValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
];

const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid status"),
];

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Brand routes (protected)
router.get("/brand/my-products", protect, requireBrand, getMyProducts);
// POST with optional file upload - handles both JSON and multipart form data
router.post("/", protect, requireBrand, uploadMultiple, createProduct);
router.put(
  "/:id",
  protect,
  requireBrand,
  checkOwnership,
  updateProductValidation,
  updateProduct,
);
router.delete("/:id", protect, requireBrand, checkOwnership, deleteProduct);

// Image upload
router.post("/upload", protect, requireBrand, uploadMultiple, uploadImages);

// Product status management
router.put(
  "/:id/publish",
  protect,
  requireBrand,
  checkOwnership,
  publishProduct,
);
router.put("/:id/draft", protect, requireBrand, checkOwnership, saveAsDraft);

module.exports = router;
