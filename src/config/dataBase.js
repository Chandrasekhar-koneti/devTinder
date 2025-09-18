const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://konetichandra123_db_user:VKHvQ3sJiuuX8wgu@cluster0.gsnemle.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
