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

    if(data.firstName.length <= 4 || data.firstName.length >= 30) {
        throw new Error('firstName should be between 4 and 30')
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

module.exports = {
    validateSignupData,
    validateLogin
}