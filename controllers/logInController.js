    const User = require('../models/user');
const {validationResult} = require('express-validator');

//Get log in
const logInHome = (req, res) => {
    return res.status(200).render('logIn');
}

//log in to an acount
const logIn = (req, res, next) => {

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(req.body);
        const values = req.body;
        const errors = validationErrors.mapped();      

        return res.status(400).render('login', {
            values: values,
            errors: errors
        }); 
    }

    const {username, password} = req.body;

    User.findOne({username}, (err, user) => {
        if(err || !user) {
            return res.status(400).render('login', {
                values: req.body,
                error: "El nombre o contraseña son incorrectos"
            });
        }

        //Check if the user exists
        let isCorrect = user.isCorrectPassword(password);

        if(!isCorrect) {
            return res.status(400).render('login', {
                values: req.body,
                error: "El nombre o contraseña son incorrectos"
            });
        }

        //Sign in
        const access_token = user.authenticate();

        //Save session
        req.session.access_token = access_token;

        //Response
        return res.redirect('/documents');
    });
}

const logout = (req, res) => {
    req.user = ""
    req.session.destroy((err) => {
        if (err){
            console.log(err);
            res.status(500).render('500');
        }
        return res.redirect('/login');
    });
}

module.exports = {
    logIn,
    logInHome,
    logout
};