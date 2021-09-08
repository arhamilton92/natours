/** @format */

const express = require('express');
const {
	signup,
	login,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect
} = require('../controllers/authController');
const {
	getAllUsers,
	createUser,
	getUser,
	updateMe,
	updateUser,
	deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);
router.patch('/updatemypassword', protect, updatePassword);
router.patch('/updateme', protect, updateMe)
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
