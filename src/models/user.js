const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    lastName: {
        type: String,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        required: true,
        validate: (value) => {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data in not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg?semt=ais_items_boosted&w=740"
    },
    about: {
        type: String,
        default: "This is the default about of the user",
        trim: true
    },
    skills: {
        type: [String],
    }
    },
    { timestamps: true }
)

const user = mongoose.model("user", userSchema);

module.exports = user;