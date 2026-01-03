const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new  Error("Not a valid email " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: (value) => {
            if (!validator.isStrongPassword(value)) {
                throw new  Error("Not a strong password " + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "other"],
            message: '{VALUE} gender is not allowed'
        },
    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg?semt=ais_items_boosted&w=740",
        validate: (value) => {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about of the user",
        trim: true,
        maxLength: 250
    },
    skills: {
        type: [String],
    }
    },
    { timestamps: true }
)

userSchema.methods.getJWT = async function () {
    try {
        let user = this
        let JwtToken = jwt.sign({ userId: user._id }, 'Namaste@Dev', { expiresIn : '1d'});
        return JwtToken
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message) 
    }
}

userSchema.methods.validatePassword = async function (inputPassword) {
    try {
        let user = this
        let validPwd = await bcrypt.compare(inputPassword, user.password)
        return validPwd
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message) 
    }
}




const User = mongoose.model("user", userSchema);

module.exports = User;