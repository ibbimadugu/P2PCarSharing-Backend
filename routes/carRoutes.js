import express from "express";
import { protect } from "../middleware/auth.js";
import Car from "../models/Car.js";
import upload from "../middleware/upload.js"; // <-- added multer upload middleware

const router = express.Router();

// POST /api/cars - Add a new car with image upload
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, pricePerDay, location } = req.body;

    const newCar = new Car({
      title,
      pricePerDay,
      location,
      image: `/uploads/${req.file.filename}`, // <-- image from uploaded file
      owner: req.user._id,
    });

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    console.error(err);
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
