/** @format */

const express = require('express');
const { protect, restrict } = require('../controllers/authController');
const {
	getReview,
	getAllReviews,
	createReview,
} = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', checkID);

router
	.route('/')
	.get(protect, getAllReviews)
	.post(protect, restrict(['admin', 'lead']), createReview);
router.route('/:id').get(getReview);

module.exports = router;
