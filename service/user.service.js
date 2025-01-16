const Users = require('../database/model/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.createUser = async(data)=>{
    const {code, fullname, telephone, username, password } = data
    if(!(code && fullname && telephone && username && password)){
        return {
            statusCode:400,
            message:"Please fill in complete information."
        }
    }

    const findUser = await Users.findOne({UserName:username})
    if(!findUser){
        const hastPassword = await bcrypt.hash(password,10)
        const createUser = new Users({
            Code:code,
            FullName:fullname,
            TelePhone:telephone,
            UserName:username,
            Password:hastPassword,
        })
        const saveUser = await createUser.save()
        if(saveUser){
            const tokens = jwt.sign(
                {code:saveUser.Code, username:saveUser.UserName,fullname:saveUser.FullName},
                process.env.JWT_SECRET,
                {expiresIn:"1d"}
            )
            return {
                statusCode:201,
                message:"create user success",
                data:saveUser,
                token:tokens
            }
        }
        return {
            statusCode:404,
            message:"error is not create user"
        }
    }
    return {
        statusCode:203,
        message:"have user"
    }
}

exports.loginUser = async (data)=>{
    
    const {username, password} = data
    if(!(username && password)){
        return {
            statusCode:400,
            message:"Please enter username or password"
        }
    }
    const findUserName = await Users.findOne({UserName:username})
    if(findUserName && (await bcrypt.compare(password, findUserName.Password))){
        const tokens = jwt.sign(
            {code:findUserName.Code, username:findUserName.UserName,fullname:findUserName.FullName},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        return {
            statusCode:201,
            message:"login success",
            token:tokens
        }
    }else{
        return {
            statusCode:203,
            message:"username or password is incorrect"
        }
    }
}

exports.getProfile = async (requser)=>{
    
    try{
        const findProfile = await Users.findOne({Code:requser.code}).select('-Password')

        if(findProfile){
            return {
                statusCode:200,
                message:"get profile success",
                data:findProfile
            }
        }
    }catch(e){
        console.log("Is Error:",e)
        return {
            statusCode:404,
            message:`IS Error Is Not get Profile`
        }
    }
}

exports.chengPassword = async(data)=>{
    try{
        const hastPassword = await bcrypt.hash(data.password,10)
        const updatePassword = await Users.updateOne(
            {Code:data.code},
            {Password:hastPassword},
            {new:true}
        )
        if(updatePassword){
            return {
                statusCode:200,
                message:"update password success",
                data:updatePassword
            }
        }
    }catch(e){
        return {
            statusCode:401,
            message:"มีข้อผิดพลาด update failed"
        }
    }
}

exports.getAllUser = async ()=>{
    try{
        const findAll = await Users.find().select("-Password")
        if(findAll){
            return {
                statusCode:201,
                message:"get user all success",
                data:findAll
            }
        }
        return {
            statusCode:401,
            message:"Is not User"
        }
    }catch(e){
        console.log(`Is Error :${e}`)
        return{
            statusCode:404,
            message:"Is Error"
        }
    }
}

exports.updateUser = async (data)=>{
    const findUser = await Users.findOne({Code:{$ne:data.code},UserName:data.username})
    if(findUser){
        return {
            statusCode:401,
            message:"ไม่สามารถ update เป็น username นี้ได้เนื้องจาก มีusername นี้ในระบบแล้ว"
        }
    }else{
        const updateUsers = await Users.updateOne(
            {Code:data.code},
            {
                FullName:data.fullname,
                TelePhone:data.telephone,
                UserName:data.username,
            },
            {new:true}
        )
        if(updateUsers){
            return {
                statusCode:200,
                message:"update success",
                data:updateUsers
            }
        }
        return {
            statusCode:403,
            message:"update false"
        }
    }
}

exports.deleteUser = async (code)=>{
    const deleteUser = await Users.deleteOne({Code:code})
    if(!deleteUser){
        return {
            statusCode:404,
            message:"User not found"
        }
    }
    return {
        statusCode:200,
        message:"User Delete successfully",
        data:deleteUser
    }
}