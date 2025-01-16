const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    Code:String,
    FullName:String,
    TelePhone:String,
    UserName:String,
    Password:String,
    createDate:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('User',UserSchema)