const jwt = require('jsonwebtoken');
const User = require("../models/user")


const userAuth = async (req, res, next) => {
    try {
        // Extract the token from cookies
        const { token } = req.cookies;
        
        if (!token) {
            console.error("[userAuth] No token found in cookies");
            return res.status(401).send("Access Denied! No token provided.")
        }

        // Decode the token
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let { userId } = decoded

        // Verify the user 
        let user = await User.findById(userId)
        if(!user) {
            console.error("[userAuth] Invalid token: User not found");
            return res.status(401).send("Access Denied! Invalid token.")
        } 

        // TODO check user status (active/inactive)

        // Attach user to request object
        req.user = user
        next()
    }catch (error) {
        console.error("Error: ", error);
        res.status(400).send('[userAuth] Error in verifying user: '+ error.message)
    }
}

module.exports = {
    userAuth
}