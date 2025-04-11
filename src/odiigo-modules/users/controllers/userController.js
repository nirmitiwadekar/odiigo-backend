const asyncHandler = require('express-async-handler');
const UserProfile = require('../model/userProfile');

// Get all users with advanced filtering and pagination
const getUsers = asyncHandler(async (req, res) => {
    const {
        q,
        name,
        email,
        phone,
        gender,
        isActive,
        _sort = "createdAt",
        _order = "desc",
        _page = 1,
        _limit = 10
    } = req.query;

    let filter = {};

    // Full-text search across multiple fields
    if (q) {
        filter.$or = [
            { name: new RegExp(q, "i") },
            { email: new RegExp(q, "i") },
            { phone: new RegExp(q, "i") }
        ];
    }

    // Apply individual filters
    if (name) filter.name = new RegExp(name, "i");
    if (email) filter.email = new RegExp(email, "i");
    if (phone) filter.phone = new RegExp(phone, "i");
    if (gender) filter.gender = new RegExp(gender, "i");
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Parse pagination parameters
    const page = parseInt(_page);
    const limit = parseInt(_limit);
    const skip = (page - 1) * limit;

    // Determine sorting
    const sortField = _sort === "id" ? "_id" : _sort;
    const sortOrder = _order === "asc" ? 1 : -1;
    const sortOptions = { [sortField]: sortOrder };

    // Count total matching records
    const totalCount = await UserProfile.countDocuments(filter);

    // Fetch paginated, filtered, and sorted data
    const users = await UserProfile.find(filter)
    .populate('_id', 'name email phone')
    .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .select('-__v'); // Exclude version key

    // Set X-Total-Count header for pagination
    res.setHeader('X-Total-Count', totalCount);
    res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');

    res.status(200).json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    const user = await UserProfile.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
});

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, email, phone, dob, gender, profilePic, vehicle, isActive, address } = req.body;

    // Check if the user already exists by email or phone
    const userExists = await UserProfile.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new UserProfile({ 
        name, 
        email, 
        phone, 
        dob, 
        gender, 
        profilePic, 
        vehicle, 
        isActive,
        address 
    });

    await user.save();
    res.status(201).json(user);
});

// Update a user
const updateUser = asyncHandler(async (req, res) => {
    const user = await UserProfile.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await UserProfile.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await UserProfile.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await UserProfile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};