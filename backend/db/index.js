const mongoose = require('mongoose');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    console.log(`DB using Development Environment`);
};
const dbUrl = process.env.REACT_APP_MONGODB || process.env.DATABASEURL || process.env.DB_URL;

// local database: __________________________________________________________________________
// mongoose.connect('mongodb://127.0.0.1:27017/instant_pot_recipes', {
mongoose.connect(dbUrl)
    .then(() => console.log('Connected to the DTPlatform database!'))
    .catch(error => console.error('Connection error', error.message));

const db = mongoose.connection;

module.exports = db;