const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRound = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
        unique: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "document"
    }]

}, {timestamps: true});

userSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        let document = this;

        bcrypt.hash(document.password, saltRound, (err, hashedPassword) => {
            if (err) {
                next(err);

            } else {
                document.password = hashedPassword;
                next();
            }
        });

    } else {
        next();
    }
});

userSchema.methods.isCorrectPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.authenticate = function() {
    const userObj = {
        _id: this._id,
        username: this.username,
        password: this.password,
        documents: this.documents
    }
    
    //Create token
    return token = jwt.sign(Object.assign({}, userObj), process.env.SECRET_TOKEN_JWT, { expiresIn: 60*60*4 }); //Expires in 4 hours
}

module.exports = mongoose.model('user', userSchema, 'users');