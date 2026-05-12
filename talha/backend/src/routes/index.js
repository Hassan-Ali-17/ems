const router = require('express').Router();

router.use('/health', require('./healthRoutes'));
router.use('/auth', require('./authRoutes'));
router.use('/events', require('./eventRoutes'));
router.use('/registrations', require('./registrationRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;