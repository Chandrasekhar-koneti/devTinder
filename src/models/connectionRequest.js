const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const connectionModelSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionModelSchema.pre("save", function (next) {
  const connectRequest = this;

  if (connectRequest.fromUserId.equals(connectRequest.toUserId)) {
    throw new Error("Sending request to yourself is not allowed");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionModelSchema);
