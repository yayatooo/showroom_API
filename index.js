const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sellAtRouter = require("./app/routers/sellAtRouter");
const categoryRouter = require("./app/routers/categoryRouter");
const url = "mongodb://127.0.0.1:27017/showroom";
const app = express();
const port = 3000;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(cors());
app.use(sellAtRouter);
app.use(categoryRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
