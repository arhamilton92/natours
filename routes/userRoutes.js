/** @format */

const express = require('express');
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
} = require('../controllers/authController');
const {
	getMe,
	getAllUsers,
	getUser,
	updateMe,
	updateUser,
	deleteUser,
	deleteMe,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers);
router
	.route('/me')
	.get(protect, getMe, getUser)
	.patch(protect, updateMe)
	.delete(protect, deleteMe);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
//
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
//
router.patch('/resetpassword/:token', resetPassword);
router.patch('/updatemypassword', protect, updatePassword);

module.exports = router;
