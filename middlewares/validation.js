const validation = (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (username.length < 5) {
    return res
      .status(400)
      .json({ success: false, msg: "username length must be greater than 5" });
  }
  if (password.length < 5) {
    return res
      .status(400)
      .json({ success: false, msg: "password length must be greater than 5" });
  }
  next();
};

module.exports = validation;
