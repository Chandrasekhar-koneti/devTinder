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
    origin: [
      "http://localhost:5173",
      "https://devswipe-ck.in",
      "https://www.devswipe-ck.in",
    ],
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
    const PORT = process.env.PORT || 2222;
    app.listen(PORT, () => {
      console.log("server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });
