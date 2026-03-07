const validator = require("validator")

let validateSignupData = (data) => {
    const requiredFields = ['firstName', 'lastName', 'emailId', 'password']
    const inputFields = Object.keys(data)

    let missingRequiredFields = requiredFields.filter((ele) => !inputFields.includes(ele)) 
    let extraFields = inputFields.filter((ele) => !requiredFields.includes(ele))

    if (missingRequiredFields.length > 0) {
        throw new Error(`Required Fields are missing`)
    }

    if (extraFields.length > 0) {
        throw new Error(`Invalid Parameters`)
    }

    if(data.firstName.length < 3 || data.firstName.length > 30) {
        throw new Error('firstName should be between 3 and 30')
    } else if(!validator.isEmail(data.emailId)) {
        throw new Error('Invalid Email')
    } else if(!validator.isStrongPassword(data.password)) {
        throw new Error('Enter Strong password')
    }
}

let validateLogin = (data) => {
    if (!data.emailId && !data.password) {
        throw new Error('Invalid parameter')
    }
}

let validateProfileEdit = (data) => {
    let allowFields = ['firstName', 'lastName', 'age', 'skills', 'about', 'photoUrl', 'gender', 'emailId'];

    let isAllowed = Object.keys(data).every((key) => allowFields.includes(key))
    if (!isAllowed) {
        throw new Error("Invalid Data")
    }
}

let validateProfilePassword = (data) => {
    let allowFields = ['newPassword', 'confirmPassword'];

    let isAllowed = Object.keys(data).every((key) => allowFields.includes(key))
    if (!isAllowed) {
        throw new Error("Invalid Data")
    }

    if (data.newPassword !== data.confirmPassword) {
        throw new Error("Both password should be same")
    }

    if (!validator.isStrongPassword(data.newPassword)) {
        throw new Error("Use strong password")
    }
}

module.exports = {
    validateSignupData,
    validateLogin,
    validateProfileEdit,
    validateProfilePassword
}