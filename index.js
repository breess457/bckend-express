require('dotenv').config()
require('./database/conect-db').connect()
const express = require('express')
const bodyParser = require('body-parser')
const core = require('cors')
const userRouter = require('./router/user.router')

const app = express()

app.use(core())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

app.use((req,res,next)=>{
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

app.use('/api',userRouter)

app.get('/',(req,res,next)=>{
    res.send("Hello Expresss")
})

app.listen(process.env.PORT,()=>console.log("Start Api On Port:",process.env.PORT))