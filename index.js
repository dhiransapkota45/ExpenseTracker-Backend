const express = require("express")
const app = express()

const userRouter = require("./routes/userRoute")
const expenseRouter = require("./routes/expenseRoute")

//connecting to database
const connection = require("./db")
connection()

app.use(express.json())
app.use("/api", userRouter)
app.use("/api", expenseRouter)

app.listen(4000, ()=>console.log("listening to the server"))