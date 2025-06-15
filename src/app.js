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
        console.log("Internal Server Error");
        res.status(500).send("Internal Server Error")
    }
})


app.get('/user', async (req, res) => {
    try {
        const result = await user.findOne({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Intetnal Server Error")
    }
})

app.get('/feed', async (req, res) => {
    try {
        const result = await user.find({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Intetnal Server Error")
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await user.findByIdAndDelete(userId)
        res.status(200).send("User is deleted")
    } catch(error) {
        console.error(error)
        res.status(500).send("Intetnal Server Error")
    }
})

app.patch('/user', async (req, res) => {
    try {
        const userId = req.body.userId;
        const updateData = req.body;
        const result = await user.findByIdAndUpdate(userId, updateData, { select: ["lastName"]})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Intetnal Server Error")
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
        res.status(500).send("Intetnal Server Error")
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
