const User = require("../models/userAuthModel");
const jwt = require("jsonwebtoken");
const getToken = require("../middleware/getToken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "5d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(201).send({ auth: true, token: token, userId: user._id });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).send({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = getToken(req);
    console.log("token ini adalah", token);
    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided" });
    }

    const user = await User.findOneAndUpdate(
      { token }, // Find user by token
      { token: null }, // Set token to null
      { new: true } // Return the updated user document
    );
    // Check if user was found and token was removed
    if (!user) {
      return res.status(404).send({ auth: false, message: "User not found" });
    }

    console.log("token :", user.token);

    res.status(200).send({ auth: false, token: null });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server Error" });
  }
};

module.exports = { registerUser, loginUser, logout };
