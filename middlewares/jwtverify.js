const jwt = require("jsonwebtoken")
require('dotenv').config()

const jwtverify = (req, res, next) => {
    const token = req.header("authToken")
    if(!token){
        res.status(400).json({msg:"Couldnot find token" , success:false})
    }
    const payLoad = jwt.verify(token, process.env.JWT_SECRET)
    req.id = payLoad.id
    next();
}

module.exports = jwtverify