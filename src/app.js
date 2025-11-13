const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    // console.log("connected to db");
    app.listen(2222, () => {
      // console.log("server is running on port 2222");
    });
  })
  .catch((err) => {
    // console.log(" error connecting to db ", err);
  });
