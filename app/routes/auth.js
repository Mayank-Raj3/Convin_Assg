const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
  try {
    let { password } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    req.body.password = passwordHash;

    const userObj = new User(req.body); // Create a new instance
    await userObj.save();

    console.log(`New user registered: ${userObj.email}`);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        createdAt: userObj.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(400).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`Login failed: User not found for email: ${email}`);
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isCorrectPassword = await user.validatePassword(password);
    if (isCorrectPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, { httpOnly: true });
      console.log(`User logged in: ${user.email}`);
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

// logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    console.log("User logged out successfully");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error during user logout:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
});

module.exports = router;
