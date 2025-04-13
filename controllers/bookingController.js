import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

// @desc    Book a car
// @route   POST /api/bookings
// @access  Private
export const bookCar = async (req, res) => {
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

    car.isBooked = true;
    car.bookedBy = req.user._id;
    await car.save();

    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
