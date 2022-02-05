//modules
const express = require("express");
const router = express.Router();

//middlwares
const jwtverify = require("../middlewares/jwtverify");

//mongoose models
const expenseModel = require("../models/expenseModel");

//add expense
router.post("/addexpense", jwtverify, async (req, res) => {
  const { category, expense, price } = req.body;
  const userId = req.id;

  //validation
  if (!expense || !price) {
    return res.status(400).json({ success: false, msg: "fill completely" });
  }
  if (Number.isInteger(price)) {
    return res.status(400).json({ success: false, msg: "Number expected" });
  }

  //expense creation
  const expenseData = await expenseModel.create({
    userId: userId,
    category,
    expense,
    price,
  });

  //response
  return res
    .status(201)
    .json({ success: true, msg: "expense created successfully", expenseData });
});

//delete expense using id of expense
router.delete("/deleteExpense/:id", jwtverify, async (req, res) => {
  const userId = req.id;
  const expenseId = req.params.id;

  //check whether user authorized
  if (!userId) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
  }

  //check whether expense exists or not
  const expenseDetail = await expenseModel.findOne({ _id: expenseId });
  if (!expenseDetail) {
    return res
      .status(400)
      .json({ success: false, msg: "expense does not exists" });
  }

  //making sure that user is modifying or deleting only own expenses
  const expense = await expenseModel.findOne({
    $and: [{ _id: expenseId }, { userId: userId }],
  });
  if (!expense) {
    return res.status(400).json({
      success: false,
      msg: "Unauthorized! expense did not match with user",
    });
  }

  //deleting the expense
  await expenseModel.deleteOne({ _id: expenseId });

  //response
  return res
    .status(200)
    .json({ success: true, msg: "expense has been deleted", expense });
});

//read all the expenses of the user
router.get("/readallexpenses", jwtverify, async (req, res) => {
  const userId = req.id;

  //check whether user is authorized
  if (!userId) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
  }

  //reading all the user's expenses
  const allExpense = await expenseModel.find({ userId });

  //send all the expenses as response
  return res
    .status(400)
    .json({ success: true, msg: "All items has been read", allExpense });
});

//customized read operation
router.get(`/readbyprice/:operation/:price`, jwtverify, async (req, res) => {
  const userId = req.id;
  const operation = req.params.operation;

  // check weather user is authenticated or not
  if (!userId) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
  }

  //different conditional statements for different operations(greaterthanprice and lessthanprice)
  //for greater than operation
  if (operation === "gt") {
    const expensegtprice = await expenseModel.find({
      $and: [{ price: { $gt: req.params.price } }, { userId }],
    });
    if (!expensegtprice) {
      return res.status(204).json({ success: false, msg: "No data found" });
    }
    return res.status(200).json({ success: true, msg: "", expensegtprice });

    //for less than operation
  } else if (operation === "lt") {
    const expenseltprice = await expenseModel.find({
      $and: [{ price: { $lt: req.params.price } }, { userId }],
    });
    if (!expenseltprice) {
      return res.status(204).json({ success: false, msg: "No data found" });
    }
    return res.status(200).json({ success: true, msg: "", expenseltprice });

    //for invalid operation
  } else {
    return res
      .status(400)
      .json({ success: false, msg: "Invalid operaion defined" });
  }
});

//update existing expenses
router.put("/updateexpense/:id", jwtverify, async (req, res) => {
  const userId = req.id;

  // check weather user is authenticated or not
  if (!userId) {
    return res.status(401).json({ success: false, msg: "Unauthorized!" });
  }

  //read the expense and that should be user's
  const readExpense = await expenseModel.findOne({
    $and: [{ userId, id: req.params.id }],
  });
  if (!readExpense) {
    return res
      .status(404)
      .json({ success: false, msg: "expense not found with that id" });
  }

  //making a object includng only to those items that needs to be updated
  const { category, expense, price } = req.body;
  const updatingData = {};
  if (category) {
    updatingData.category = category;
  }
  if (expense) {
    updatingData.expense = expense;
  }
  if (price) {
    updatingData.price = price;
  }

  //updation
  //{new:true} basically returns new updated data
  const updateExpense = await expenseModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatingData },
    { new: true }
  );

  //response
  return res
    .status(200)
    .json({
      success: true,
      msg: "data has been updated successfully",
      updateExpense,
    });
});

module.exports = router;
