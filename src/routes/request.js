const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        let user = req.user
        res.send(user.firstName + " has sent the request succesfully")
    } catch(error) {
        console.error('Error: ', error.message)
        res.status(400).send('Error: '+ error.message)
    }
})

module.exports = requestRouter