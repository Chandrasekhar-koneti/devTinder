const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const { validateEditProfileData } = require("../utils/UserValidations");
//profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedUser[field] = req.body[field])
    );
    loggedUser.save();
    res.send({
      msg: `${loggedUser.firstName} your details updated successfully`,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = profileRouter;
