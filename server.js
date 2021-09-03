const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app'); // EXPRESS

dotenv.config({ path: './.env' }); // ENV variables

// DATABASE //
const password = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE.replace('<PASSWORD>', password);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}); // --------------------------------

// SERVER //
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
}); // --------------------------------
