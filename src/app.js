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
