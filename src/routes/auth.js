const express = require("express");

const authRouter = express.Router();

const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpBody } = require("..//utils/UserValidations");

//signup
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpBody(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      about,
      photoUrl,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      about,
      photoUrl,
    });
    await user.save();

    res.send("user added ");
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ msg: messages[0] });
    }

    res.status(400).json({ err: err.message });
  }
});

//signin
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const findUser = await User.findOne({ emailId: emailId });

    if (!findUser) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await findUser.validatePassword(password);

    if (isPasswordValid) {
      const token = await findUser.getJwt();
      res.cookie(
        "token",
        token,
        { expires: new Date(Date.now() + 60 * 60 * 1000) } // can use   maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
      );
      res.send({ msg: "Login sucessfull" });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ msg: messages[0] });
    }

    res.status(400).json({ err: err.message });
  }
});

//logout

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send({ msg: "User logged out successfully" });
});

module.exports = authRouter;
