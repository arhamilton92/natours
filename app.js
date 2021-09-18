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
// UTILS
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
// ---------------------------

const app = express();

// SET UP PUG TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// ---------------------------
// GLOBAL MIDDLEWARE 
// ---------------------------

// ENV SETUP
if (process.env.NODE_ENV === 'development') {
	// DEV LOGGING
	console.log('development');
	app.use(morgan('dev')); // DEV LOGGING
}
// SET SECURITY HTTP HEADERS
app.use(helmet()); 

// LIMIT IP REQUEST RATE
const limiter = rateLimit({
	max: 2000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// PARSE & LIMIT REQ BODY SIZE
app.use(express.json({ limit: '10kb' }));

// DATA SANITIZATION
app.use(mongoSanitize()); // noSQL query injection
app.use(xss()); // XSS

// PREVENT PARAM POLLUTION
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

app.use(express.static(path.join(__dirname, 'views'))); // SERVE STATIC FILES

// --------------------------------
// ROUTER
// --------------------------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/review', reviewRouter);
//
app.all('*', (req, res, next) => {
	// incorrect URL error
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
