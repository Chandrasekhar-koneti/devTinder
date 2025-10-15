const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about age gender skills";

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const getRequestList = await ConnectionRequest.find({
      toUserId: loggedInUser?._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.send({ msg: "Data fetched successfully", getRequestList });
  } catch (err) {
    res.send({ error: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser?._id, status: "accepted" },
        { fromUserId: loggedInUser?._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send({ data });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = userRouter;
