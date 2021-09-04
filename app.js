/** @format */

const express = require('express');
const morgan = require('morgan');
//
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
	console.log('development');
	app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// ------------------------------------

// ROUTER
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//
app.all('*', (req, res, next) => { // incorrect URL error
	next(new AppError(`Can't find ${req.originalUrl}`, 404))
});
app.use(globalErrorHandler); // --------------------------------

module.exports = app;
