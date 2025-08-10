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
                if(connection.toUserId._id.toString() === loggedInUser._id.toString()) {
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

userRouter.get("/user/feed", 
    userAuth, 
    async (req, res) => {
        try {
            let loggedInUserId = req.user._id.toString()
            let page = parseInt(req.query.page )|| 1
            let limit = parseInt(req.query.limit) || 10
            
            limit = limit > 50 ? 50 : limit;
            let skip = (page * limit) - limit

            let getIntractedUsers = await ConnectionRequest.find(
                {
                    "$or": [
                        { toUserId: loggedInUserId },
                        { fromUserId: loggedInUserId}
                    ]
                }
            ).select("toUserId fromUserId")

            let uniqueIntractedUsers = new Set()
            getIntractedUsers.map((user) => {
                uniqueIntractedUsers.add(user.toUserId.toString())
                uniqueIntractedUsers.add(user.fromUserId.toString())
            })

            let feed = await User.find(
                { 
                    "$and" :[
                        {"_id" : { "$nin" : Array.from(uniqueIntractedUsers)}},
                        {"_id" : { "$ne": loggedInUserId }}
                    ]
                }
            )
            .select("firstName lastName skills photoUrl gender age about")
            .skip(skip)
            .limit(limit)

            res.status(200).send({message: "Data fetched successfully",data : feed })
        } catch(error) {
            console.error('Error: ', error.message)
            res.status(400).send({message :'Error: '+ error.message})
        }
    }
)
module.exports = userRouter