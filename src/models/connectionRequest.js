const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        }, 
        status: {
            type: String,
            enum: {
                values: ["interested",  "ignored",  "accepted",  "rejected"],
                message: '{VALUE} status is not allowed'
            },
            required: true
        }
    }, 
    { timestamps: true }
)

connectionRequestSchema.index({toUserId: 1, fromUserId: 1}, {sparse: true})

connectionRequestSchema.pre('save', function(next) {
    if(this.toUserId.equals(this.fromUserId)) {
        throw new Error('User can send request to yourself')
    }
    next()
})

const ConnectionRequest = mongoose.model('connectionRequest' , connectionRequestSchema)

module.exports = ConnectionRequest;