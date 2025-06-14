import User from "../models/User.model.js";

export const createUser = async (req, res) => {
  try {
    console.log("Received request to create user:", req.body);

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
      full_name: `${firstName} ${lastName}`.trim(),
      email: email,
      password: password, // In production, you should hash the password
      role: "homeowner", // Default role
      address: {
        street,
        city,
        state,
        zip,
      },
    });

    const savedUser = await newUser.save();

    // Omit password in response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
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
