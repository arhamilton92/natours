/** @format */

const express = require('express');
const { protect, restrict } = require('../controllers/authController');
const {
    allowNestedRoutes,
	getReview,
	getAllReviews,
	createReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// router.param('id', checkID);

router
	.route('/')
	.get(getAllReviews)
	.post(protect, restrict(['user']), allowNestedRoutes, createReview);
router
	.route('/:id')
	.get(getReview)
	.patch(protect, restrict(['user', 'admin']), updateReview)
	.delete(protect, restrict(['user', 'admin']), deleteReview);

module.exports = router;
