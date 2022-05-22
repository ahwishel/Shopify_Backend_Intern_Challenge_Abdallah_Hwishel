const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const routes = require('./Routes/routes')
const app = express()

//Middleware and routes
app.use(cors()) //To prevent any cors issues while testing front-end
app.use(express.urlencoded({ extended: true }))
app.use(routes) //Use API route

app.use(express.static(path.join(__dirname, 'build')))
//Handle any other requests that aren't API routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
    console.log("Successfully connected to inventory DB")
})

app.listen(process.env.PORT || 5001, () => {
    console.log(`Server listening on ${process.env.PORT || 5001}`)
})