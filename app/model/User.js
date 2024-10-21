const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const { SALT } = require("../config/config");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name should have at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Mobile number should contain exactly 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should have at least 6 characters"],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const payload = {
    userId: user._id,
    email: user.email,
  };

  try {
    const token = await jwt.sign(payload, SALT, { expiresIn: "1h" });
    return token;
  } catch (error) {
    console.error("Error generating JWT:", error);
    throw new Error("Error generating JWT");
  }
};

userSchema.methods.validatePassword = async function (passwordInput) {
  const user = this;
  const passwordHash = user.password;
  try {
    const isCorrectPassword = await bcrypt.compare(passwordInput, passwordHash);
    return isCorrectPassword;
  } catch (error) {
    console.error("Error validating password:", error);
    throw new Error("Invalid email or password");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
