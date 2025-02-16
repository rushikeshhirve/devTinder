const express = require('express')
const app = express();
const PORT = 3000

app.use('/', (req, res)=> {
    res.end("Your response is sent successfully")
})


app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}` )
})