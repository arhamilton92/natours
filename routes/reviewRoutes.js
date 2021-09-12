/** @format */

const express = require('express');
const { protect } = require('../controllers/authController');
const {
getReview, getAllReviews
} = require('../controllers/reviewController');

const router = express.Router();

// router.param('id', checkID);

router
	.route('/')
	.get(protect, getAllReviews)
router
	.route('/:id')
	.get(getReview)

module.exports = router;
