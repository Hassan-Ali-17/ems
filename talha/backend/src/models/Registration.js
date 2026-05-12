const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketId: { type: String, unique: true, default: () => `TKT-${uuidv4().split('-')[0].toUpperCase()}` },
    status: { type: String, enum: ['confirmed', 'cancelled', 'attended', 'pending'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['free', 'paid', 'pending', 'refunded'], default: 'free' },
    amountPaid: { type: Number, default: 0 },
    attendeeInfo: {
      name: String,
      email: String,
      phone: String
    },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
    ticketPath: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

registrationSchema.post('save', async function incrementCounter(doc) {
  if (doc.status === 'confirmed') {
    const Event = mongoose.model('Event');
    await Event.findByIdAndUpdate(doc.event, { $inc: { registeredCount: 1 } });
  }
});

registrationSchema.pre('findOneAndDelete', async function decrementCounter() {
  const doc = await this.model.findOne(this.getFilter());
  if (doc && doc.status === 'confirmed') {
    const Event = mongoose.model('Event');
    await Event.findByIdAndUpdate(doc.event, { $inc: { registeredCount: -1 } });
  }
});

module.exports = mongoose.model('Registration', registrationSchema);