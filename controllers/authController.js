// controllers/authController.js

import jwt from "jsonwebtoken"; // For generating JWT tokens
import User from "../models/User.js"; // User model
import bcrypt from "bcryptjs"; // For hashing and comparing passwords

// ✅ REGISTER FUNCTION
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user with given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with created user's basic info
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN FUNCTION
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ error: err.message });
  }
};
