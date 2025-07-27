const express = require("express")
const requestRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", 
    userAuth, 
    async (req, res) => {
        try {
            let fromUserId = req.user._id;
            let { status, toUserId } = req.params;

            if (!['interested', 'ignored'].includes(status)) {
                throw new Error(`${status} status is not allowed`)
            }

            let toUser = await User.findById(toUserId)
            if(!toUser) {
                throw new Error('To user is not found')
            }

            let isConnectionExist = await ConnectionRequest.findOne(
                { $or: [
                    {toUserId, fromUserId},
                    {toUserId : fromUserId, fromUserId: toUserId}
                ]}
            )
            if(isConnectionExist) {
                return res.status(200).send({message: 'Connection is already exist'})
            }
            
            let connectionReq = new ConnectionRequest({
                toUserId,
                fromUserId,
                status
            })

            await connectionReq.save()
            res.send({message : req.user.firstName + " is " + status + " in " + toUser.firstName})
        } catch(error) {
            console.error('Error: ', error.message)
            res.status(400).send({message :'Error: '+ error.message})
        }
    }
)

requestRouter.post('/request/review/:status/:requestId', 
    userAuth, 
    async (req, res) => {
        try {
            let loggedInUser = req.user;
            let { status, requestId } = req.params;

            // validation for status
            if(!['accepted',  "rejected"].includes(status)) {
                throw new Error(`${status} status is not allowed`)
            }

            // check perticuler reqid exist
            let connectionReq = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: 'interested'
            })
            if (!connectionReq) {
                throw new Error(`Connection Request Not Exists`)
            }

            // update the instance
            connectionReq.status = status;
            await connectionReq.save();
            res.status(200).json({message:`Connection request is ${status}.`, data: connectionReq})
        }  catch(error) {
            console.error('Error: ', error.message)
            res.status(400).send({message :'Error: '+ error.message})
        }
    }
)

module.exports = requestRouter