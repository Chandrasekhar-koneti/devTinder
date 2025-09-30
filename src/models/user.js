const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
    default: "https://images.pexels.com/photos/982021/pexels-photo-982021.jpeg",
    trim: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo url" + value);
      }
    },
  },
});

module.exports = mongoose.model("User", userSchema);
