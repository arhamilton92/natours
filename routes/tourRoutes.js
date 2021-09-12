/** @format */

const express = require('express');
const { protect, restrict } = require('../controllers/authController');
const {
	aliasTopTours,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
} = require('../controllers/tourController');
const { createReview } = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', checkID);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);
router
	.route('/')
	.get(protect, getAllTours)
	.post(protect, restrict(['admin', 'lead']), createTour);
router
	.route('/:id')
	.get(getTour)
	.patch(protect, restrict(['admin', 'lead']), updateTour)
	.delete(protect, restrict(['admin', 'lead']), deleteTour);

router.route('/:tourId/reviews').post(protect, restrict(['user']), createReview);

module.exports = router;
