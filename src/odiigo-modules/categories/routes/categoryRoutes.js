const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controller/categoryController');

// Routes for categories

router.get('/', getCategories); // Get all categories
router.get('/:id', getCategoryById); // Get category by ID with attached services
router.post('/', createCategory); // Create a new category
router.put('/:id', updateCategory); // Update category by ID
router.delete('/:id', deleteCategory); // Delete category by ID

module.exports = router;
