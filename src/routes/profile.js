const express = require("express");
const validator = require("validator");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

const { validateEditProfileData } = require("../utils/UserValidations");
//profile api
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const findUser = req.user;
    const safeUserData = (({
      firstName,
      lastName,
      photoUrl,
      about,
      age,
      gender,
      skills,
    }) => ({ firstName, lastName, photoUrl, about, age, gender, skills }))(
      findUser
    );

    res.send({ msg: "profile fetched successfully", profile: safeUserData });
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
    const safeLoggedUserData = (({
      firstName,
      lastName,
      photoUrl,
      about,
      age,
      gender,
      skills,
    }) => ({ firstName, lastName, photoUrl, about, age, gender, skills }))(
      loggedUser
    );

    res.send({
      msg: `${loggedUser.firstName} your details updated successfully`,
      safeLoggedUserData,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
});

profileRouter.patch("/profile/passowrd", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      return res
        .status(400)
        .send({ msg: "Old and new passwords are required" });
    }

    const passwordHash = req.user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new Error("Old passowrd is incorrect");
    }
    if (!newPassword) {
      throw new Error("New password is required");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password is weak" + newPassword);
    }
    const isSame = await bcrypt.compare(newPassword, passwordHash);
    if (isSame) {
      return res
        .status(400)
        .send({ msg: "New password cannot be same as old password" });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    req.user.password = newPasswordHash;

    await req.user.save();

    res.send({ msg: "Password changed successfully" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = profileRouter;
