/** @format */

const express = require('express');
const { protect, restrict } = require('../controllers/authController');
const {
	getReview,
	getAllReviews,
	createReview,
	deleteReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

// router.param('id', checkID);

router
	.route('/')
	.get(protect, getAllReviews)
	.post(protect, restrict(['user']), createReview);
router.route('/:id').get(getReview).delete(protect, deleteReview);

module.exports = router;
