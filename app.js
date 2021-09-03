/** @format */

const express = require('express');
const morgan = require('morgan');

// DEFINE ROUTERS
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// DEFINE EXPRESS
const app = express();

// MIDDLWARE
if (process.env.NODE_ENV === 'development') {
    console.log('development');
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

/// USE ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
