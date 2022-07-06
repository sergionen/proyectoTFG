const { body, validationResult } = require('express-validator')

const signUpValidationRules = () => {
  return [
    //Cannot be blank
    body('username').trim().notEmpty().withMessage("Campo requerido"),
    //Cannot be blank
    body('password').trim().notEmpty().withMessage("Campo requerido"),
    //Cannot be blank
    body('confirmPassword').trim().notEmpty().withMessage("Campo requerido"),
    //Username must be alphanumeric
    body('username').isAlphanumeric().withMessage("El nombre de usuario debe ser de caracteres alfanuméricos"),
    //Password must be at least 8 chars long
    body('password').isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres."),
    //Passwords must match
    body('password').custom((password, {req}) => {
        if(password != req.body.confirmPassword){
            throw new Error('Las contraseñas deben coincidir')
        }
        return true;
    })
    ]
}

const logInValidationRules = () => {
    return [
        //Cannot be blank
        body('username').trim().notEmpty().withMessage("Campo requerido"),
        //Cannot be blank
        body('password').notEmpty().withMessage("Campo requerido")
    ] 
}

module.exports = {
    signUpValidationRules,
    logInValidationRules
}