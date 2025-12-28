const express = require('express')
const app = express();
const PORT = 3000
const { connectDB } = require("./config/database")
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/", authRouter, profileRouter, requestRouter, userRouter)

console.log("Connecting to the database...")
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
