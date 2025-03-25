const asyncHandler = require('express-async-handler');
const UserProfile = require('../model/userProfile');

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const users = await UserProfile.find();
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
    const user = new UserProfile({ name, email, phone, dob, gender, profilePic, vehicle, isActive, address });

    await user.save();
    res.status(201).json(user);
});

// Update a user
const updateUser = asyncHandler(async (req, res) => {
    const user = await UserProfile.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await UserProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });

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
