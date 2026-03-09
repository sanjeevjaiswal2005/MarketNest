const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateUser,
  getBrandProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.get('/brand/:id', getBrandProfile);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);

module.exports = router;

