require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.dbConnection, {
    useNewUrlParser: true
})
    .then(db => console.log("DB is connected."))
    .catch(err => console.error(err));