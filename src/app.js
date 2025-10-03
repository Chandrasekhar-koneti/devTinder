const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();
const { validateSignUpBody } = require("./utils/UserValidations");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

//signup
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//profile api
app.get("/profile", userAuth, async (req, res) => {
  try {
    const findUser = req.user;

    res.send({ msg: "profile fetched successfully", profile: findUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ msg: messages[0] });
    }

    res.status(400).json({ err: err.message });
  }
});

//send connection req

app.post("/sendConnection", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending connection");
  res.send(user.firstName + " connection request send");
});

connectDB()
  .then(() => {
    // console.log("connected to db");
    app.listen(2222, () => {
      // console.log("server is running on port 2222");
    });
  })
  .catch((err) => {
    // console.log(" error connecting to db ", err);
  });
