const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getDashboardStats = async (req, res) => {
  const [totalUsers, totalEvents, totalRegistrations, attendeeUsers, organizerUsers, adminUsers, upcomingEvents] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments(),
    User.countDocuments({ role: 'attendee' }),
    User.countDocuments({ role: 'organizer' }),
    User.countDocuments({ role: 'admin' }),
    Event.countDocuments({ date: { $gte: new Date() } })
  ]);

  const recentUsers = await User.find().sort('-createdAt').limit(5).select('-password');
  const recentEvents = await Event.find().sort('-createdAt').limit(5).populate('organizer', 'name email');

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalEvents,
      totalRegistrations,
      upcomingEvents,
      usersByRole: { attendee: attendeeUsers, organizer: organizerUsers, admin: adminUsers }
    },
    recentUsers,
    recentEvents
  });
};

const getUsers = async (req, res) => {
  const filter = {};

  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }, { organization: regex }];
  }

  const users = await User.find(filter).sort('-createdAt').select('-password');
  res.json({ success: true, users });
};

const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, message: 'User updated successfully.', user });
};

const deactivateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, message: 'User deactivated successfully.', user });
};

module.exports = { getDashboardStats, getUsers, updateUser, deactivateUser };