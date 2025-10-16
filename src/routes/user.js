const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 30 ? 30 : limit;

    const skip = (page - 1) * limit;

    const usersList = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser?._id }, { fromUserId: loggedInUser?._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromList = new Set();
    usersList.forEach((req) => {
      hideUsersFromList.add(req.fromUserId);
      hideUsersFromList.add(req.toUserId);
    });

    const usersToShow = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromList) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    if (usersToShow.length === 0) {
      return res.status(200).json({
        message: "No more users to show",
        usersToShow: [],
        page,
      });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      usersToShow,
      page,
    });
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = userRouter;
