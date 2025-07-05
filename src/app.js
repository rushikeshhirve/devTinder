const express = require('express')
const app = express();
const PORT = 3000
const { connectDB } = require("./config/database")
const User = require("./models/user")
const { validateSignupData, validateLogin } = require("./utils/validation")
const bcrypt = require('bcrypt');


app.use(express.json())

app.post('/signup',async (req, res) => {
    try {
        // Validate
        validateSignupData(req.body)
        const data = req.body

        // Password hash
        let hashedPassword = await bcrypt.hash(data.password, 10)
        console.log(hashedPassword)
        
        // Create a new instance of user with req.data
        const userDetails = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            emailId: data.emailId,
            password: hashedPassword
        })

        await userDetails.save()
        res.status(201).send("User is added succesfully")

    } catch(error) {
        console.log("Sign up failed:" + error.message);
        res.status(500).send("Sign up failed:" + error.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        // Validation
        validateLogin(req.body)

        // check user exist
        const userDetails = await User.findOne({emailId: req.body.emailId}, ['password']).lean()
        if(!userDetails) {
            throw new Error('Invalid credentials!')
        }

        let checkPwd = await bcrypt.compare(req.body.password, userDetails.password)
        if (!checkPwd) {
            throw new Error('Invalid credentials!')
        } 

        res.status(200).send('Login Successful!')

    } catch(error) {
        console.error('Error while login: ', error.message)
        res.status(400).send('Error while login: '+ error.message)
    }
})

app.get('/user', async (req, res) => {
    try {
        const result = await User.findOne({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("User get failed:" + error.message)
    }
})

app.get('/feed', async (req, res) => {
    try {
        const result = await User.find({})
        res.status(200).send(result)
    } catch(error) {
        console.error(error)
        res.status(500).send("Feed API failed:" + error.message)
    }
})

app.delete('/user', async (req, res) => {
    try {
        const userId = req.body.userId
        const result = await User.findByIdAndDelete(userId)
        res.status(200).send("User is deleted")
    } catch(error) {
        console.error(error)
        res.status(500).send("Delete user failed:" + error.message)
    }
})

app.patch('/user/:userId', async (req, res) => {
    try {
        const userId = req.params?.userId;
        const updateData = req.body;

        const ALLOWED_UPDATED_PARAMS = ["firstName", "lastName", "age", "about", "skills", "password", "photoUrl"]

        const updateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATED_PARAMS.includes(k))

        if(!updateAllowed) {
            throw new Error("Update not allowed")
        }

        if(updateData.skills.length > 10) {
            throw new Error("Skills more than 10 not allowd.")
        }

        const result = await User.findByIdAndUpdate(
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
        const result = await User.findOneAndUpdate({emailId: emailId}, updateData, { select: ["lastName"], strict : false}).lean()
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
