const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

// Get all categories
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('services');
    res.status(200).json(categories);
});

// Get category by ID
// @route GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('services');

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
});

// Create new category
// @route POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json(category);
});

// Update category by ID
// @route PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedCategory);
});

// Delete category by ID
// @route DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
});

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
