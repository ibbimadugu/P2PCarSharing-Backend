import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// POST /api/bookings
router.post("/", protect, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Ensure car exists and is available for booking
    const car = await Car.findById(carId);
    if (!car || car.isBooked) {
      return res.status(400).json({ message: "Car is unavailable" });
    }

    // Convert startDate and endDate to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Check if the dates are valid
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }

    // Calculate the number of total days
    const totalDays = Math.ceil(
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24)
    );

    // Ensure totalDays is a positive number
    if (totalDays <= 0) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Calculate total price
    const totalPrice = totalDays * car.pricePerDay;

    // Ensure pricePerDay is a valid number
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid total price calculation" });
    }

    // Create the booking
    const booking = new Booking({
      car: carId,
      user: req.user._id,
      startDate: startDateObj,
      endDate: endDateObj,
      totalPrice,
    });

    // Save the booking
    await booking.save();

    // Update the car's booking status
    car.isBooked = true;
    car.bookedBy = req.user._id;
    await car.save();

    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// GET /api/bookings - Get all bookings (for an admin or user)
router.get("/", protect, async (req, res) => {
  try {
    // If the user is an admin, fetch all bookings
    if (req.user.role === "admin") {
      const bookings = await Booking.find().populate("car user");
      return res.status(200).json(bookings);
    }

    // If the user is a normal user, fetch only their bookings
    const bookings = await Booking.find({ user: req.user._id }).populate("car");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve bookings" });
  }
});

// GET /api/bookings/:id - Get a specific booking by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("car user");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is the one who booked the car or if the user is an admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this booking" });
    }

    res.status(200).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to retrieve the booking" });
  }
});

// DELETE /api/bookings/:id/remove-car - Remove car from a booking
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this booking" });
    }

    // Mark car as available again
    const car = await Car.findById(booking.car);
    if (car) {
      car.isBooked = false;
      car.bookedBy = null;
      await car.save();
    }

    await booking.deleteOne();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

export default router;
