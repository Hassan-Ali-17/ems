const fs = require('fs');
const path = require('path');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const { generateTicketPDF } = require('../utils/ticketGenerator');

const getMyRegistrations = async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate('event')
    .sort('-createdAt');

  res.json({ success: true, registrations });
};

const cancelRegistration = async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate('event');

  if (!registration) {
    return res.status(404).json({ success: false, message: 'Registration not found.' });
  }

  const isOwner = registration.user.toString() === req.user._id.toString();
  const isEventOwner = registration.event.organizer.toString() === req.user._id.toString();
  const canManage = req.user.role === 'admin' || isOwner || isEventOwner;

  if (!canManage) {
    return res.status(403).json({ success: false, message: 'You cannot cancel this registration.' });
  }

  const deleted = await Registration.findOneAndDelete({ _id: registration._id });
  if (deleted?.ticketPath && fs.existsSync(deleted.ticketPath)) {
    fs.unlinkSync(deleted.ticketPath);
  }

  res.json({ success: true, message: 'Registration cancelled successfully.' });
};

const downloadTicket = async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate('user').populate('event');

  if (!registration) {
    return res.status(404).json({ success: false, message: 'Registration not found.' });
  }

  const isOwner = registration.user._id.toString() === req.user._id.toString();
  const isEventOwner = registration.event.organizer.toString() === req.user._id.toString();
  const canAccess = req.user.role === 'admin' || isOwner || isEventOwner;

  if (!canAccess) {
    return res.status(403).json({ success: false, message: 'You cannot access this ticket.' });
  }

  let ticketPath = registration.ticketPath;
  if (!ticketPath || !fs.existsSync(ticketPath)) {
    ticketPath = await generateTicketPDF(registration, registration.event, registration.user);
    registration.ticketPath = ticketPath;
    await registration.save({ validateBeforeSave: false });
  }

  const fileName = `ticket-${registration.ticketId}.pdf`;
  return res.download(ticketPath, fileName);
};

module.exports = { getMyRegistrations, cancelRegistration, downloadTicket };