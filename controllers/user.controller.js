import User from "../models/User.model.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "../config/resend.js";

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const newUser = new User({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email,
      password: password, // In production, you should hash the password
      role: "homeowner", // Default role
      verificationToken: uuidv4(),
      address: {
        street,
        city,
        state,
        zip,
      },
    });

    const savedUser = await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, newUser.verificationToken);

    res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Email verification function
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      isVerified: false,
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
