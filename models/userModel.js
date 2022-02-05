const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        unique:true
    },
    password:{
        type:String
    }
})

const userModel = new mongoose.model("usermodel", userSchema)
module.exports = userModel