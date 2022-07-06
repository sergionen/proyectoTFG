const User = require('../models/user');
const {validationResult} = require('express-validator');
const userValidations = require('../validations/userValidations');

//Get sing up
const singUpHome = (req, res) => {
    return res.status(200).render('signup');
}

//Create a user
const signUp = (req, res) => {

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(req.body);
        const values = req.body;
        const errors = validationErrors.mapped();      

        return res.status(400).render('signup', {
            values: values,
            errors: errors
        })
    }

    const user = new User(req.body);
    user.save((err, newUser) => {
        if(err) {
            console.log(err);
            const values = req.body;
            return res.status(400).render('signup', {
                values: values,
                error: "El nombre de usuario ya existe"
            });
        }

        const access_token = user.authenticate();

        //Save session
        req.session.access_token = access_token;
        return res.redirect('/documents');
    });
}

module.exports = {
    signUp,
    singUpHome
};
