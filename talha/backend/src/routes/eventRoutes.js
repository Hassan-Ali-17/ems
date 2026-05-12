const router = require('express').Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  registerForEvent,
  getEventRegistrations
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { eventSchema, updateEventSchema } = require('../validators/eventValidators');

router.get('/', getEvents);
router.get('/my', protect, authorize('admin', 'organizer'), getMyEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorize('admin', 'organizer'), validate(eventSchema), createEvent);
router.put('/:id', protect, authorize('admin', 'organizer'), validate(updateEventSchema), updateEvent);
router.delete('/:id', protect, authorize('admin', 'organizer'), deleteEvent);
router.post('/:id/register', protect, authorize('admin', 'organizer', 'attendee'), registerForEvent);
router.get('/:id/registrations', protect, authorize('admin', 'organizer'), getEventRegistrations);

module.exports = router;