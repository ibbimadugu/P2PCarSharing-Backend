import express from "express";
import Car from "../models/Car.js";
import upload from "../middleware/upload.js"; // Importing upload from middleware

const router = express.Router();

// POST /api/cars - Add a new car with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, pricePerDay, location, owner } = req.body;

    const newCar = new Car({
      title,
      pricePerDay,
      location,
      owner,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Server error creating car" });
  }
});

// GET /api/cars - List available cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find({ isBooked: false });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

export default router;
