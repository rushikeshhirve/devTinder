const express = require("express")
const userRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/received", 
    userAuth,
    async (req, res) => {
        try {
            let loggedInUser = req.user;
            let getRequest = await ConnectionRequest
            .find(
                { 
                    toUserId: loggedInUser._id,
                    status : 'interested'
                }
            )
            .populate("fromUserId", "firstName lastName about photoUrl skills")

            res.status(200).send({message: "Data fetched successfully",data : getRequest})
        } catch(error) {
            console.error('Error: ', error.message)
            res.status(400).send({message :'Error: '+ error.message})
        }
    }
)

userRouter.get("/user/connections",
    userAuth,
    async(req, res) => {
        try {
            let loggedInUser = req.user;
            let getConnections = await ConnectionRequest
            .find(
                { 
                    "$or" : [
                        { toUserId: loggedInUser._id, status : 'accepted'},
                        { fromUserId: loggedInUser._id,status : 'accepted'}
                    ]
                }
            )
            .populate("fromUserId", "firstName lastName about photoUrl skills")
            .populate("toUserId", "firstName lastName about photoUrl skills")

            getConnections = getConnections.map(connection => {
                if(connection.toUserId._id.equals(loggedInUser._id)) {
                    return connection.fromUserId}
                else 
                    return connection.toUserId
            })

            res.status(200).send({message: "Data fetched successfully",data : getConnections})
        } catch(error) {
            console.error('Error: ', error.message)
            res.status(400).send({message :'Error: '+ error.message})
        }
    }
)
module.exports = userRouter