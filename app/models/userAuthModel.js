const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { required } = require("nodemon/lib/config");

const userAuth = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userAuth.static.signup = async function (email, password) {
  // validation

  if (!email || !password) {
    throw Error("Email dan Password harus diisi");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email Salah");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password Lemah");
  }

  const exist = await this.findOne({ email });

  if (exist) {
    throw Error("email sudah digunakan");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash });

  return user;
};

userAuth.static.login = async function (email, password) {
  if (!email || !password) {
    throw new Error("Email atau Password tidak boleh kosong");
  }

  const user = this.findOne({ email });
  if (!user) {
    throw Error("User tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Password Salah");
  }

  return user;
};

const User = mongoose.model("User", userAuth);

module.exports = User;
