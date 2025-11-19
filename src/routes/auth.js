const express = require("express");

const authRouter = express.Router();

const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl about age gender skills";
const jwt = require("jsonwebtoken");
const { validateSignUpBody } = require("../utils/UserValidations");
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

    const findDuplicateUser = await User.findOne({ emailId });
    if (findDuplicateUser) {
      throw new Error("Email already exist");
    }

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

    res.send({ msg: "user added" });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages[0] });
    }

    res.status(400).json({ error: err.message });
  }
});

//signin
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const findUser = await User.findOne({ emailId });

    if (!findUser) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await findUser.validatePassword(password);

    if (isPasswordValid) {
      const token = await findUser.getJwt();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // required for HTTPS
        sameSite: "none", // required for cross-origin cookies
        maxAge: 60 * 60 * 1000,
      });

      const { password, emailId, ...safeUser } = findUser.toObject();

      res.send({ code: 200, msg: "Login sucessfull", userDetails: safeUser });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ msg: messages[0] });
    }

    res.status(400).json({ err: err.message });
  }
});

authRouter.get("/verify-token", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token found" });
    }

    // verify token
    const decoded = jwt.verify(token, "cskchandra@123");

    // find user by ID
    const user = await User.findById(decoded._id).select(
      "firstName lastName  photoUrl"
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // token valid
    res.json({ valid: true, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

//logout
authRouter.post("/logout", (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .send({ msg: "User logged out successfully" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = authRouter;
