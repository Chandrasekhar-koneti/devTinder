const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email" + value);
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak" + value);
        }
      },
    },

    age: {
      type: Number,
      required: true,
      trim: true,
      max: 80,
      min: 15,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is invalid");
        }
      },
    },
    about: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://images.pexels.com/photos/982021/pexels-photo-982021.jpeg",
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url" + value);
        }
      },
    },
    skills: {
      type: [String],
      // validate: {
      //   validator: function (value) {
      //     return value.length > 0 && value.length <= 8;
      //   },
      //   message: function (props) {
      //     if (props.value.length === 0) {
      //       return "At least 1 skill is required";
      //     }
      //     return "Skills must be less than or equal to 8";
      //   },
      // },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user.id }, "cskchandra@123", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
