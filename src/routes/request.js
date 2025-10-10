const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
//send connection req

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const toUserId = req.params.toUserId;

      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error(`${status} is not valid`);
      }

      const exisitingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (exisitingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      const findToUserId = await User.findById(toUserId);
      if (!findToUserId) {
        throw new Error("User not found");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });
      await connectionRequest.save();
      res.send({
        msg:
          status === "interested"
            ? `${req.user.firstName} ${status} in your profile`
            : `${req.user.firstName} ${status}  your profile`,
        connectionRequest,
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
);

module.exports = requestRouter;
