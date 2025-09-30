const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();
const { validateSignUpBody } = require("./utils/UserValidations");
const User = require("./models/user");
const bcrypt = require("bcrypt");
app.use(express.json());
const validator = require("validator");

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
    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (isPasswordValid) {
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

//to find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail }); //findOne method is to get 1st object if mutiple result
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//feed api to get all users data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    // console.log(userId);
    const deletedUser = await User.findByIdAndDelete(userId);
    // console.log("wrong");
    res.send(deletedUser);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;
    const NotAllowedDetails = ["emailId"];

    if (Object.keys(data).some((field) => NotAllowedDetails.includes(field))) {
      return res.status(500).send({ msg: "email updating not allowed" });
    }

    const updateUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    if (!updateUser) {
      return res.status(404).send("User not found");
    }
    res.send(updateUser);
  } catch (err) {
    res.status(400).send({ msg: "something went wrong", error: err });
  }
});

connectDB()
  .then(() => {
    console.log("connected to db");
    app.listen(2222, () => {
      console.log("server is running on port 2222");
    });
  })
  .catch((err) => {
    console.log(" error connecting to db ", err);
  });
