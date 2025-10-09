const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

//send connection req

requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending connection");
  res.send(user.firstName + " connection request send");
});

module.exports = requestRouter;
