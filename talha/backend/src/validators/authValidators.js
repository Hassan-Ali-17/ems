const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('attendee', 'organizer').default('attendee'),
  organization: Joi.string().max(100).allow('').default(''),
  phone: Joi.string().max(30).allow('').default('')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().max(30).allow('').optional(),
  bio: Joi.string().max(500).allow('').optional(),
  organization: Joi.string().max(100).allow('').optional(),
  avatar: Joi.string().allow('').optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema };