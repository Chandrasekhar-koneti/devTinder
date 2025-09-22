const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.send("user added ");
  } catch (err) {
    res.status(400).send("bad response");
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

app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const data = req.body;
    const updateUser = await User.findByIdAndUpdate(userId, data);
    console.log("updated");
    res.send(updateUser);
  } catch (err) {
    res.status(400).send("something went wrong");
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
