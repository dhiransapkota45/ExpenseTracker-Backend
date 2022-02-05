const mongoose = require("mongoose")
const userModel = require("./userModel")

const expenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel
    },
    category:{
        type:String,
        default:"Others"
    },
    expense:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default: new Date()
        // .toISOString().split("T")[0]
    }
    
})

const expenseModel = new mongoose.model("expensemodel", expenseSchema)
module.exports = expenseModel