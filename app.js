/** @format */

const path = require('path');
const express = require('express');
// DEV
const morgan = require('morgan');
// SECURITY
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
// UTILS
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// ---------------------------

const app = express();

// pug template engine set up
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ---------------------------
// GLOBAL MIDDLEWARE
// ---------------------------

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// env setup
if (process.env.NODE_ENV === 'development') {
	console.log('development');
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

// test middleware
// app.use((req, res, next) => {
// 	console.log(req.cookies)
// 	next()
// })

// --------------------------------
// ROUTER
// --------------------------------

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);

// incorrect URL error handler
app.all('*', (req, res, next) => {
	next(new AppError(`Page does not exist.`, 404));
});
// use custom error handling util
app.use(globalErrorHandler);

module.exports = app;
