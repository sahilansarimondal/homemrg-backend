import User from "../models/User.model.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = new User({
      username,
      email,
      password, // In production, you should hash the password
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
