// // src/routes/auth.js
// const express = require('express');
// const router = express.Router();
// const authCtrl = require('../controllers/authController');

// router.post('/register', authCtrl.register);
// router.post('/login', authCtrl.login);

// module.exports = router;

const express = require("express");
// const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    res.status(201).json({
      message: "User registered successfully",
    //   token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
