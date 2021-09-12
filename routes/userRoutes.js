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
	getUser,
	updateMe,
	updateUser,
	deleteUser,
	deleteMe
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);
router.patch('/updatemypassword', protect, updatePassword);
router.patch('/updateme', protect, updateMe)
router.delete('/deleteme', protect, deleteMe)
router.route('/').get(getAllUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
