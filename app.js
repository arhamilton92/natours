/** @format */

const express = require('express');
const morgan = require('morgan');

// DEFINE ROUTERS
const tourRouter = require('./routes/tourRoutes.js')
const userRouter = require('./routes/userRoutes.js')

// DEFINE EXPRESS
const app = express();

// MIDDLWARE
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`))

/// USE ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app