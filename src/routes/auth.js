const express = require("express")
const User = require("../models/user")
const { validateSignupData, validateLogin } = require("../utils/validation")
const bcrypt = require('bcrypt');

const authRouter = express.Router()

authRouter.post('/signup',async (req, res) => {
    try {
        // Validate
        validateSignupData(req.body)
        const data = req.body

        // Check Email id already exist or not 
        const isEmailExist = await User.exists({emailId : data.emailId})
        if(isEmailExist) return res.status(400).json({message : `${data.emailId} email is already exist.`})

        // Password hash
        let hashedPassword = await bcrypt.hash(data.password, 10)
        
        // Create a new instance of user with req.data
        const userDetails = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            emailId: data.emailId,
            password: hashedPassword
        })

        await userDetails.save()
        res.status(201).send("User is added succesfully")

    } catch(error) {
        console.log("Sign up failed:" + error.message);
        res.status(500).send("Sign up failed:" + error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        // Validation
        validateLogin(req.body)

        // check user exist
        const userDetails = await User.findOne({emailId: req.body.emailId}, ['password'])
        if(!userDetails) {
            throw new Error('Invalid credentials!')
        }

        let checkPwd = await userDetails.validatePassword(req.body.password)
        if (!checkPwd) {
            throw new Error('Invalid credentials!')
        } 

        // Create A JWT token 
        let JwtToken = await userDetails.getJWT();

        // Send the jwt in cookies 
        res.cookie("token", JwtToken, { expires: new Date(Date.now() + 24 * 3600000)})

        res.status(200).send('Login Successful!')

    } catch(error) {
        console.error('Error while login: ', error.message)
        res.status(400).send('Error: '+ error.message) 
    }
})

authRouter.post("/logout", async (req, res) => {
    res.clearCookie("token")
    res.send("Logged out")
})

module.exports = authRouter
