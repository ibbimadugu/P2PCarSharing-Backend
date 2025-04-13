import express from "express";
import { protect } from "../middleware/auth.js";
import Car from "../models/Car.js";

const router = express.Router();

// POST /api/cars - Add a new car
router.post("/", protect, async (req, res) => {
  try {
    const newCar = new Car({ ...req.body, owner: req.user._id });
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ message: "Failed to add car" });
  }
});

// GET /api/cars - List available cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({ isBooked: false }).populate("owner", "name");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

export default router;
