/** @format */

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factory = require('./handlerFactory');

// BASIC CRUD
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
	// get booked tour
	const tour = await Tour.findById(req.params.tourId);
	if (!tour) return next(new AppError('There is no tour with that id!', 404));
	//
	// create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		// URL FOR TESTING ONLY // INSECURE
		// success_url: `${req.protocol}://${req.get('host')}/?tour=${
		// 	req.params.tourId
		// }&user=${req.user.id}&price=${tour.price}`,
		success_url: `${req.protocol}://${req.get('host')}/my-tours`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		line_items: [
			{
				name: `${tour.name} Tour`,
				description: tour.summary,
				images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
				amount: tour.price * 100,
				currency: 'usd',
				quantity: 1,
			},
		],
	});
	//
	return res.status(200).json({
		status: 'success',
		session,
	});
});

// FOR DEV ONLY/TESTING // INSECURE
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
// 	const { tour, user, price } = req.query;
// 	if (!tour && !user && !price) return next();
// 	await Booking.create({ tour, user, price });
// 	res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async (session) => {
	const tour = session.client_reference_id;
	const user = User.findOne({ email: session.customer_email })._id;
	const price = session.display_items[0].amount / 100;
	await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
	const signature = req.headers['stripe-signature'];

	let event;
	try {
		const event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
		if (event.type === 'checkout.session.completed') {
			createBookingCheckout(event.data.object);
		}
		res.status(200).json({ recieved: true });
	} catch (error) {
		return res.status(400).send(`Webhook error: ${error.message}`);
	}
};
