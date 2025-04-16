const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

exports.adminSignup = async (req, res) => {
  const { email, password, name } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const admin = await Admin.create({ email, password, name });
  res.status(201).json({ message: 'Admin created', adminId: admin._id });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email }
  });
};
