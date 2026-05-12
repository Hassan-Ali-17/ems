const Event = require('../models/Event');
const Registration = require('../models/Registration');
const ApiFeatures = require('../utils/apiFeatures');

const getEvents = async (req, res) => {
  const baseQuery = Event.find({ status: 'published' }).populate('organizer', 'name email organization avatar role');
  const features = new ApiFeatures(baseQuery, req.query).search().filter().sort().paginate();
  const events = await features.query;
  const total = await Event.countDocuments(features.query.getFilter());

  res.json({
    success: true,
    events,
    pagination: {
      page: features.pagination.page,
      limit: features.pagination.limit,
      total,
      totalPages: Math.max(Math.ceil(total / features.pagination.limit), 1)
    }
  });
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email organization avatar role');

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (event.status !== 'published' && req.user) {
    const isOwner = event.organizer._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'This event is not available.' });
    }
  }

  if (event.status !== 'published' && !req.user) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  res.json({ success: true, event });
};

const createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user._id });
  res.status(201).json({ success: true, message: 'Event created successfully.', event });
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You cannot edit this event.' });
  }

  Object.assign(event, req.body);
  await event.save();

  res.json({ success: true, message: 'Event updated successfully.', event });
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You cannot delete this event.' });
  }

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();

  res.json({ success: true, message: 'Event deleted successfully.' });
};

const getMyEvents = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { organizer: req.user._id };
  const events = await Event.find(filter).sort('-createdAt');

  res.json({ success: true, events });
};

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (event.status !== 'published') {
    return res.status(400).json({ success: false, message: 'This event is not open for registration.' });
  }

  if (event.registeredCount >= event.capacity) {
    return res.status(400).json({ success: false, message: 'The event is fully booked.' });
  }

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing) {
    return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
  }

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
    attendeeInfo: { name: req.user.name, email: req.user.email, phone: req.user.phone || '' },
    paymentStatus: event.price > 0 ? 'pending' : 'free',
    amountPaid: 0
  });

  const populatedRegistration = await Registration.findById(registration._id).populate('user').populate('event');

  res.status(201).json({ success: true, message: 'Registration successful.', registration: populatedRegistration });
};

const getEventRegistrations = async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found.' });
  }

  if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'You cannot view registrations for this event.' });
  }

  const registrations = await Registration.find({ event: event._id }).populate('user', 'name email phone role');
  res.json({ success: true, registrations });
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getMyEvents, registerForEvent, getEventRegistrations };