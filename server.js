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
app.listen(port, () => {
	console.log(`App running on port ${port}`);
}); // --------------------------------
