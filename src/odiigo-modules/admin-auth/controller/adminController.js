const { sendResetEmail } = require('../../../config/email/email');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const adminSignup = async (req, res) => {
  const { email, password, name } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin already exists' });

  const admin = await Admin.create({ email, password, name });
  res.status(201).json({ message: 'Admin created', adminId: admin._id });
};

const adminLogin = async (req, res) => {
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

const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(200).json({
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    } 

    // generate a secure random token
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const resetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex');
    const resetTokenExpiration = Date.now() + 3600000;

    // save the token and expiration to the user record
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = resetTokenExpiration;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendResetEmail(admin.email, resetUrl);
    
    res.status(200).json({
      message: 'If a user with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
}

const adminResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if(!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if(!admin) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
}

module.exports = {
  adminSignup,
  adminLogin,
  adminForgotPassword,
  adminResetPassword
};