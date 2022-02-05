const mongoose = require("mongoose")
require("dotenv").config()

const connetion = async() => {
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("conneted to database");
}

module.exports = connetion