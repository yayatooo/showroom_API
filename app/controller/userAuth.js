const User = require("../models/userAuthModel");
const jwt = require("jsonwebtoken");
const getToken = require("../middleware/getToken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "15m" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    user.token = token;
    await user.save();
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
    user.token = token;
    await user.save();
    res.status(200).send({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ auth: false, message: "User not found" });
    }

    // Remove the token from the user
    user.token = null;
    await user.save();

    res.status(200).json({ auth: false, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { registerUser, loginUser, logout };
