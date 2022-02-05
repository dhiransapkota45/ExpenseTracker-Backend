//modules
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
require('dotenv').config()

//middlewares
const validation = require("../middlewares/validation");
const confirmPassword = require("../middlewares/confirmPassword");
const hashPassword = require("../middlewares/hashPassword");

//mongoose model
const userModel = require("../models/userModel");


//testing
router.get("/", (req, res) => {
  res.send("Test-1:success");
});


//signup
router.post("/signup", validation, confirmPassword, async (req, res) => {
  const { username, password } = req.body;

  //check whether username already exists or not
  const checkUsername = await userModel.findOne({ username: username });
  if (checkUsername) {
    return res
      .status(400)
      .json({ success: false, msg: "user with that username already exists" });
  }

  //hash the password 
  const hashedPassword = hashPassword(password);

  //User Creation
  const user = await userModel.create({ username, password: hashedPassword });

  //Signing JsonWebToken
  const payLoad = {
    id: user.id,
  };
  const authToken = jwt.sign(payLoad, process.env.JWT_SECRET);
  
  //response
  return res
    .status(200)
    .json({
      success: true,
      msg: "user has been created successfully",
      authToken,
    });
});


//login
router.post("/login", validation, async (req, res) => {
  const { username, password } = req.body;

  //check whether username exists or not
  const checkUsername = await userModel.findOne({ username });
  if (!checkUsername) {
    return res
      .status(400)
      .json({ success: false, msg: "user with that username doesnot exists" });
  }

  //check whether passwords are matching or not
  const comparePassword = await bcrypt.compare(password, checkUsername.password);
  if (!comparePassword) {
    return res.status(400).json({ success: false, msg: "Invalid credentails" });
  }

  //Signing JsonWebToken
  const auth_data = {
    id: checkUsername.id,
  };
  const authToken = jwt.sign(auth_data, process.env.JWT_SECRET);


  //response
  return res
    .status(200)
    .json({ success: true, msg: "user logged in successfully", authToken });
});

module.exports = router;
