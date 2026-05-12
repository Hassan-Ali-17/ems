const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    speaker: { type: String, default: '' }
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    venue: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    onlineLink: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0 },
    schedule: { type: [scheduleItemSchema], default: [] },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'published' },
    featured: { type: Boolean, default: false },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

eventSchema.virtual('remainingSeats').get(function remainingSeats() {
  return Math.max(this.capacity - this.registeredCount, 0);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);