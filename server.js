/** @format */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // ENV variables BEFORE EXPRESS
const app = require('./app'); // EXPRESS

// UNCAUGHT EXCEPTION HANDLER
process.on('uncaughtException', (err) => {
	console.log('uncaught exception');
	console.log(err.name, err.message);
	process.exit();
});

// DATABASE CONNECTION
const password = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace('<PASSWORD>', password);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log('DB connection successful!'));

// SERVER START
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

// UNHANDLED REJECTION HANDLER
process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

// UNHANDLED REJECTION HANDLER
process.on('SIGTERM', () => {
	console.log('----------SIGTERM RECIEVED. Shutting down.-----------')
	server.close(() => {
		console.log('------process terminated.------')
	});
});
