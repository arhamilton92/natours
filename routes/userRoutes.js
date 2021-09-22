/** @format */

const express = require('express');
const {
	signup,
	login,
	logout,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	restrict,
} = require('../controllers/authController');
const {
	getMe,
	getAllUsers,
	getUser,
	updateMe,
	updateUser,
	deleteUser,
	deleteMe,
	uploadUserPhoto,
	resizeUserPhoto
} = require('../controllers/userController');

const router = express.Router();

// PUBLIC // NOT PROTECTED
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
//
router.patch('/resetpassword/:token', resetPassword);
router.patch('/updatemypassword', protect, updatePassword);
// ------------------------------------

// MUST BE AUTHENTICATED
router.use(protect);
//
router.route('/').get(getAllUsers);
router.route('/me').get(getMe, getUser).patch(uploadUserPhoto, resizeUserPhoto, updateMe).delete(deleteMe);
// ------------------------------------

// MUST BE ADMIN
router.use(restrict(['admin']));
//
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
// ------------------------------------

module.exports = router;
