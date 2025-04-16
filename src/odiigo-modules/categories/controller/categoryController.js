const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const mongoose = require('mongoose');

// @desc    Get all categories with advanced filtering & search
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const { 
        q, 
        category_name, 
        category_description,
        _sort = "createdAt",
        _order = "desc",
        _page = 1,
        _limit = 10,
        id
    } = req.query;

    let filter = {};

    // Handle ID array for getMany requests
    if (id) {
        // If id is an array (comma separated values in the query)
        if (id.includes(',')) {
            const ids = id.split(',').map(id => {
                try {
                    return new mongoose.Types.ObjectId(id.trim());
                } catch (err) {
                    console.warn(`Invalid ObjectId format: ${id}`);
                    return null;
                }
            }).filter(id => id !== null);
            
            if (ids.length > 0) {
                filter._id = { $in: ids };
            }
        } else {
            try {
                filter._id = new mongoose.Types.ObjectId(id);
            } catch (err) {
                console.warn(`Invalid ObjectId format: ${id}`);
            }
        }
    }

    // Full-text search across multiple fields
    if (q) {
        filter.$or = [
            { category_name: new RegExp(q, "i") },
            { category_description: new RegExp(q, "i") }
        ];
    }

    // Apply individual filters
    if (category_name) filter.category_name = new RegExp(category_name, "i");
    if (category_description) filter.category_description = new RegExp(category_description, "i");

    // Parse pagination parameters
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;

    // Determine sort field and order
    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    try {
        // Count total matching documents
        const totalCount = await Category.countDocuments(filter);

        // Fetch filtered, sorted, and paginated categories
        const categories = await Category.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate('services');

        // Set X-Total-Count header for pagination
        res.setHeader('X-Total-Count', totalCount);
        res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

        // Return data
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('services');

    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = asyncHandler(async (req, res) => {
    const { category_name, category_description } = req.body;

    // Validate required fields
    if (!category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    // Check for duplicate category name
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
        return res.status(400).json({ message: "Category with this name already exists" });
    }

    // Initialize services as an empty array if not provided
    const newCategory = await Category.create({ 
        category_name, 
        category_description,
        services: []
    });

    res.status(201).json(newCategory);
});

// @desc    Update a category by ID
// @route   PUT /api/categories/:id
// @access  Public
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure required fields are present
    if (!updateData.category_name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
});

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Public
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
});

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};