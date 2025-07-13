const express = require("express")
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user")
const { validateProfileEdit, validateProfilePassword } = require("../utils/validation")
const bcrypt = require('bcrypt');

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        let user = req.user
        res.status(200).json(user)
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message)
    }
})

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
    try {
        validateProfileEdit(req.body);
        let loggedInUser = req.user;        
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.status(200).json({message: "Data is updated succesfully"})
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message)
    }
})

profileRouter.post("/profile/password", userAuth, async (req, res) => {
    try {
        validateProfilePassword(req.body);
        let { newPassword, confirmPasswprd} = req.body
        let loggedInUser = req.user;
        let hashedPassword = await bcrypt.hash(newPassword, 10)
        loggedInUser.password = hashedPassword
        await loggedInUser.save()
        res.status(200).json({message: "Password is updated succesfully"})
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message)
    }
})

module.exports = profileRouter