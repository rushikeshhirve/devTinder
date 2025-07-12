const jwt = require('jsonwebtoken');
const User = require("../models/user")


const userAuth = async (req, res, next) => {
    try {
        // Extract the token from cookies
        const { token } = req.cookies;
        
        if (!token) {
            throw new Error("Invalid Token!")
        }

        // Decode the token
        let decoded = jwt.verify(token, 'Namaste@Dev')
        let { userId } = decoded

        // Verify the user 
        let user = await User.findById(userId)
        if(!user) {
            throw new Error("User not found!")
        } 

        req.user = user
        next()
    }catch (error) {
        console.error("Error: ", error);
        res.status(400).send('Error in verifying user: '+ error.message)
    }
}

module.exports = {
    userAuth
}