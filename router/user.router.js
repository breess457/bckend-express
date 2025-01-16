const router = require('express').Router()
const userService = require('../service/user.service')
const verifyToken = require('../auth-guard/verify-token')

router.get('/test',(req,res,next)=>{
    res.status(201).json({text:"Hellow test"})
})

router.post('/crateuser',async(req, res, next)=>{
    try{
        const resultCreateUser = await userService.createUser(req.body)
        res.status(resultCreateUser.statusCode).json(resultCreateUser)
    }catch(e){
        res.status(404).json({err:e})
        console.log(e)
    }
})

router.post('/login', async(req,res, next)=>{
    try{
        const resutlLogin = await userService.loginUser(req.body)
        res.status(resutlLogin.statusCode).json(resutlLogin)
    }catch(err){
        res.status(404).json({error:err})
        console.log("Is Error : ",err)
    }
})

router.get('/profile',verifyToken,async(req,res,next)=>{
    const resultProfile = await userService.getProfile(req.user)
    res.status(resultProfile.statusCode).json(resultProfile)
})

router.put('/chengpassword', async(req,res,next)=>{
    const result = await userService.chengPassword(req.body)
    res.json(result)
})

router.get('/alluser', async(req,res,next)=>{
    const result = await userService.getAllUser()
    res.status(result.statusCode).json(result)
})

router.put('/updateuser', async(req, res, next)=>{
    const result = await userService.updateUser(req.body)
    res.json(result)
})

router.delete('/deleteuser', async(req, res, next)=>{
    const {code} = req.query
    console.log({code})
    try{
        const resultDelete = await userService.deleteUser(code)
        res.status(resultDelete.statusCode).json(resultDelete)
        console.log(resultDelete)
    }catch(e){
        res.status(500).json({message:"Server Error",error:e.message})
        console.error(e)
    }
})

module.exports = router;
