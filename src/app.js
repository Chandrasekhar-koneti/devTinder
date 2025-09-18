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
