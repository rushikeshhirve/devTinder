const mongoose = require("mongoose")

const connectDB = async function () {
    await mongoose.connect("mongodb+srv://bryceHoward:vic51ryE4ekIoL9d@cluster0.rx3ducl.mongodb.net/devTinder")
}

module.exports = {connectDB}