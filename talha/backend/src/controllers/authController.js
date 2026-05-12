const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  organization: user.organization,
  phone: user.phone,
  bio: user.bio,
  avatar: user.avatar,
  isActive: user.isActive
});

const register = async (req, res) => {
  const { name, email, password, role, organization, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'attendee',
    organization: organization || '',
    phone: phone || ''
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({ success: true, message: 'Account created successfully.', token, user: safeUser(user) });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
  }

  const matched = await user.comparePassword(password);
  if (!matched) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);
  res.json({ success: true, message: 'Login successful.', token, user: safeUser(user) });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user: safeUser(user) });
};

const updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated successfully.', user: safeUser(user) });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const matched = await user.comparePassword(currentPassword);
  if (!matched) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password changed successfully.' });
};

module.exports = { register, login, getMe, updateProfile, changePassword };