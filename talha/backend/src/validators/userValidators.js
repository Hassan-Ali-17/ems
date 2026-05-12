const Joi = require('joi');

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  role: Joi.string().valid('admin', 'organizer', 'attendee').optional(),
  organization: Joi.string().max(100).allow('').optional(),
  phone: Joi.string().max(30).allow('').optional(),
  bio: Joi.string().max(500).allow('').optional(),
  avatar: Joi.string().allow('').optional(),
  isActive: Joi.boolean().optional()
});

module.exports = { updateUserSchema };