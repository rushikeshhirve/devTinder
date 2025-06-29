const express = require('express')
const app = express();
const PORT = 3000
const { connectDB } = require("./config/database")
const user = require("./models/user")

app.use(express.json())

app.post('/signup',async (req, res) => {
    try {
        // Create a new instance of user with req.data
        const userDetails = new user(req.body)

        await userDetails.save()
        res.status(201).send("User is added succesfully")

    } catch(error) {
        console.log("Sign up failed:" + error.message);
        res.status(500).send("Sign up failed:" + error.message)
    }
})


app.get('/user', async (req, res) => {
    try {
        const result = await user.findOne({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("User get failed:" + error.message)
    }
})

app.get('/feed', async (req, res) => {
    try {
        const result = await user.find({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Feed API failed:" + error.message)
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await user.findByIdAndDelete(userId)
        res.status(200).send("User is deleted")
    } catch(error) {
        console.error(error)
        res.status(500).send("Delete user failed:" + error.message)
    }
})

app.patch('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const updateData = req.body;
        const result = await user.findByIdAndUpdate(
            userId, 
            updateData, 
            { select: { lastname: 1, skills: 1, gender: 1}, returnDocument: "after", runValidators: "true"}
        )
        res.status(200).send(result)
    } catch(error) {
        console.error(error.message)
        res.status(500).send("Update User failed:" + error.message)
    }
})

app.patch('/userByEmail', async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const updateData = req.body;
        const result = await user.findOneAndUpdate({emailId: emailId}, updateData, { select: ["lastName"], strict : false}).lean()
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Update failed:" + error.message)
    }
})

connectDB()
    .then(() => {
        console.log("Database connection established...")
        app.listen(PORT, () => {
            console.log(`Server is started on port ${PORT}...` )
        })
    })
    .catch((error) => {
        console.error("Error while connecting the Dabtabase")
    })
