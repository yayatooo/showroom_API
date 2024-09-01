require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const sellAtRouter = require("./app/routers/sellAtRouter");
const categoryRouter = require("./app/routers/categoryRouter");
const soldAtRouter = require("./app/routers/soldAtRouter");
const userAuthRouter = require("./app/routers/userAuthRouter");
const app = express();
const port = 5000;

// const url = process.env.MONGODB_URI;
const url = "mongodb://localhost:27017/showroom"

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(sellAtRouter);
app.use(categoryRouter);
app.use(soldAtRouter);
app.use(userAuthRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
