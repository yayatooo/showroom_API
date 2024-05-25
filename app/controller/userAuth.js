const User = require("../models/userAuthModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

// const getToken = require("../middleware/getToken");

// const createToken = (_id) => {
//   return jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "15m" });
// };

const secretKey = process.env.SECRET_KEY

const registerUser = async (req, res) => {
  try {
    console.log(req.body); // Log the request body to debug the issue

    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(201).json({ email, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({message: "Invalid Email or Password"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({message: "Invalid Email or Password"})
    }

    const token = jwt.sign({ id: user._id}, secretKey, {
      expiresIn: "1h"
    });

    res.json({token})
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllUser = async (req,res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// const logout = async (req, res) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   try {
//     const user = await User.findOne({ token });

//     if (!user) {
//       return res.status(404).json({ auth: false, message: "User not found" });
//     }

//     // Remove the token from the user
//     user.token = null;
//     await user.save();

//     res.status(200).json({ auth: false, message: "Logout successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error" });
//   }
// };

module.exports = { registerUser, loginUser, getAllUser };
