/** @format */

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../.env' }); // ENV variables BEFORE EXPRESS

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')); // READ JSON FILE

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('data loaded')
        process.exit()
    } catch (error) {
        console.log(error)
    }
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('data deleted')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if(process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}

console.log(process.argv)

