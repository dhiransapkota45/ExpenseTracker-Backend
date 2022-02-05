const mongoose = require("mongoose")
const databaseUrl = `mongodb://localhost:27017/expenseTracker`

const connetion = async() => {
    await mongoose.connect(databaseUrl)
    console.log("conneted to database");
}

module.exports = connetion