const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedToken = await jwt.verify(token, "cskchandra@123");

    const { _id } = decodedToken;

    const findUser = await User.findById(_id);

    if (!findUser) {
      throw new Error("User not found");
    }
    req.user = findUser;
    next();
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

module.exports = { userAuth };
