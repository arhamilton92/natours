/** @format */

const express = require('express');
const {
	protect,
	restrict
} = require('../controllers/authController');
const {
	getCheckoutSession,
	getAllBookings,
	getBooking,
	createBooking,
	updateBooking,
	deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession)

router.use(protect, restrict('admin, lead-guide'))
router.route('/').get(getAllBookings).post(createBooking)
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking)

module.exports = router;