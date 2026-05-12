const Joi = require('joi');

const scheduleItemSchema = Joi.object({
  time: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  speaker: Joi.string().allow('').optional()
});

const eventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(5000).required(),
  category: Joi.string().required(),
  date: Joi.date().iso().required(),
  endDate: Joi.date().iso().allow(null, '').optional(),
  location: Joi.string().required(),
  venue: Joi.string().allow('').optional(),
  isOnline: Joi.boolean().default(false),
  onlineLink: Joi.string().uri().allow('').optional(),
  image: Joi.string().allow('').optional(),
  price: Joi.number().min(0).required(),
  capacity: Joi.number().integer().min(1).required(),
  schedule: Joi.array().items(scheduleItemSchema).default([]),
  tags: Joi.array().items(Joi.string().allow('')).default([]),
  status: Joi.string().valid('draft', 'published', 'cancelled', 'completed').default('published'),
  featured: Joi.boolean().default(false)
});

const updateEventSchema = eventSchema.fork(
  ['title', 'description', 'category', 'date', 'location', 'price', 'capacity'],
  (field) => field.optional()
);

module.exports = { eventSchema, updateEventSchema };