const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  seedCategories
} = require('../controllers/categoryController');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Seed route (for initial setup)
router.post('/seed', seedCategories);

// Protected routes (can add admin middleware later)
router.post('/', createCategory);

module.exports = router;

