const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getUsers, updateUser, deactivateUser } = require('../controllers/adminController');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deactivateUser);

module.exports = router;