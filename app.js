const express = require('express');
var morgan = require('morgan')
const session = require('express-session')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

//Imports
const routes = require('./routes/routes');

// Connection to the DB.
require('./dbConnection');

//Variables constantes
const port = process.env.PORT || 8000;
const cookie_expiration = 1000 * 60 * 60 * 10 //10 hours in miliseconds

//Settings
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));
app.use('/css', express.static(__dirname + "/public/css"));
app.use('/js', express.static(__dirname + "/public/js"));
app.use(morgan('dev'));

//Use middlewares
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(session({
    name: 'sid',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: cookie_expiration,
        sameSite: true,
        secure: false //True in production environment
    }
  }));

//Using routes
app.use(routes);

//Error pages
app.use((req, res) => {
    res.status(404).render('404');
});

//Server running
app.listen(port, () => {
    console.log("App running.");
});