const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true,
    },

    extension: {
        type: String,
        required: true,
        trim: true,
    },

    CID: {
        type: String,
        required: true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

}, {timestamps: true});

module.exports = mongoose.model('document', documentSchema, 'documents');