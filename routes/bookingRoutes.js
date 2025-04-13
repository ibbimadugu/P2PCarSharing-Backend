import express from "express";
import { protect } from "../middleware/auth.js";
import Car from "../models/Car.js"; // ✅ correct import
import Booking from "../models/Booking.js"; // ✅ added import

const router = express.Router();

// POST /api/bookings
router.post("/", protect, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const car = await Car.findById(carId);

    if (!car || car.isBooked) {
      return res.status(400).json({ message: "Car is unavailable" });
    }

    const totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = totalDays * car.pricePerDay;

    const booking = new Booking({
      car: carId,
      user: req.user._id,
      startDate,
      endDate,
      totalPrice,
    });

    await booking.save();

    // Update the car's status
    car.isBooked = true;
    car.bookedBy = req.user._id;
    await car.save();

    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

export default router;
