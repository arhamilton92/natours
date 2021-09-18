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
	getToursWithin,
	getDistances
} = require('../controllers/tourController');
const reviewRouter = require('./reviewRoutes.js');

const router = express.Router();

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-tours').get(aliasTopTours, getAllTours);

router.route('/distances/:latlng/unit/:unit').get(getDistances);
router.route('/within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router
	.route('/')
	.get(getAllTours)
	.post(protect, restrict(['admin', 'lead-guide']), createTour);
router
	.route('/:id')
	.get(getTour)
	.patch(protect, restrict(['admin', 'lead-guide']), updateTour)
	.delete(protect, restrict(['admin', 'lead-guide']), deleteTour);

// NESTED
router.use('/:tourId/reviews', reviewRouter);
// ------------------------------------

module.exports = router;
