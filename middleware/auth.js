// middleware/auth.js
import jwt from "jsonwebtoken";

// Middleware to protect routes and verify JWT tokens
export const protect = (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    // Verify token and attach user info to request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
