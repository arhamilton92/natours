/** @format */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // ENV variables BEFORE EXPRESS
const app = require('./app'); // EXPRESS

// DATABASE
const password = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace('<PASSWORD>', password);
mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(console.log('DB connection successful!'));
// ------------------------------------

// SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
}); // --------------------------------

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

process.on('uncaughtException', (err) => {
	console.log('uncaught exception');
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
