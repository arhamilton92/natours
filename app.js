/** @format */

const path = require('path');
const express = require('express');
const compression = require('compression');
// DEV
const morgan = require('morgan');
// SECURITY
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// UTILS
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const app = express();

// pug template engine set up
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// v GLOBAL MIDDLEWARE v -------------------
// -----------------------------------------
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

// env setup
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev')); // dev logging
}
// set security http headers
app.use(helmet());
// set security policy to allow mapbox
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
			baseUri: ["'self'"],
			fontSrc: ["'self'", 'https:', 'http:', 'data:'],
			scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
			styleSrc: ["'self'", 'https:', 'http:', "'unsafe-inline'"],
		},
	})
);

// limit ip request rate
const limiter = rateLimit({
	max: 2000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// parse and limit body size
app.use(express.json({ limit: '10kb' }));
app.use(
	express.urlencoded({
		extended: true,
		limit: '10kb',
	})
);

// parse cookies
app.use(cookieParser());

// data sanitization
app.use(mongoSanitize()); // noSQL query injection
app.use(xss()); // XSS

// prevent param pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'difficulty',
			'price',
			'ratingsQuantity',
			'ratingsAverage',
			'maxGroupSize',
		],
	})
);
// -----------------------------------------
// ^ GLOBAL MIDDLEWARE ^ -------------------

// v ROUTER v -------------------
// -----------------------------------------
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// compress
app.use(compression())

// incorrect URL error handler
app.all('*', (req, res, next) => {
	next(new AppError(`Page does not exist.`, 404));
});
// use custom error handling util
app.use(globalErrorHandler);
// -----------------------------------------
// ^ ROUTER ^ ------------------------------

module.exports = app;
