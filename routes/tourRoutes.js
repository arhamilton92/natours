/** @format */

const express = require('express');
const {
	aliasTopTours,
	getAllTours,
	createTour,
	getTour,
	updateTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan
} = require('../controllers/tourController');

const router = express.Router();

// router.param('id', checkID);

router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/top-5-tours').get(aliasTopTours, getAllTours)
router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
