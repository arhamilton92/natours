const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app'); // EXPRESS

dotenv.config({ path: './.env' }); // ENV variables

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

// SCHEMA 
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    rating: {
        type: Number,
        default: 4.5,
    },
}); // --------------------------------

// MODEL 
const Tour = mongoose.model('Tour', tourSchema);
// ------------------------------------

// SERVER 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
}); // --------------------------------
