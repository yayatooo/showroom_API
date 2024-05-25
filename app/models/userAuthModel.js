const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.model("User", userAuthSchema);

module.exports = User;
