const express = require("express");

const app = express();
// console.log(object)

app.get("/dashboard", (req, res) => {
  res.send("server running on dashboard");
});

app.get("/", (req, res) => {
  res.send("starting server");
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(2222, () => {
  console.log("server is running on port 2222");
});
