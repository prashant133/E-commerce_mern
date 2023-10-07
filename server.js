const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')



const app = express()

// loading the env data
db_conn = process.env.MONGO_URL
port = process.env.PORT
// console.log(db_conn)
// console.log(port)


// middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// initial routes
app.get('/',(req , res , next)=> {
    res.send("servering is running");
})

// Routes
app.use('/api/v1/auth', authRoutes)



// connecting to the mongodb
mongoose
    .connect(db_conn)
    .then(()=>{
        app.listen(port, ()=>{
            console.log(`server running on port ${port}`)
        })
    }).catch((err)=>{
        console.log(err)
    })
