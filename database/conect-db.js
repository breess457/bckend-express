const mongoose = require('mongoose')
const {MONGO_URL} = process.env

exports.connect = ()=>{
    mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>console.log("Connect Database success #_#"))
    .catch((err)=>{
        console.log("Error Connect Database:"+err)
    })
}