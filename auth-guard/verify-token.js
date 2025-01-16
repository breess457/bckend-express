const jwt = require('jsonwebtoken')

const verifyTokens=(req,res,next)=>{
    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token']
        if(!token){
            return res.status(401).json({tokenmsg:"a token is not defind"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
    }catch(e){
        return res.status(404).send("error :",e)
    }
    next()
}

module.exports = verifyTokens;