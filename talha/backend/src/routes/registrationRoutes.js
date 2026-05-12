const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getMyRegistrations, cancelRegistration, downloadTicket } = require('../controllers/registrationController');

router.get('/me', protect, getMyRegistrations);
router.delete('/:id', protect, authorize('admin', 'organizer', 'attendee'), cancelRegistration);
router.get('/:id/ticket', protect, authorize('admin', 'organizer', 'attendee'), downloadTicket);

module.exports = router;