
const confirmPassword = (req, res, next) =>{
    const{password, confirmPassword} = req.body
    if(password !== confirmPassword){
        return res.status(400).json({success:false, msg:"password did not match"})
    }
    next()
}
module.exports = confirmPassword