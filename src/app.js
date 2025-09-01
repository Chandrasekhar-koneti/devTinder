const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ fname: "chandra", lname: "sekhar" });
});

app.post("/user", (req, res) => {
  res.send("user created");
});

app.delete("/user", (req, res) => {
  res.send("user deleted");
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
