import Booking from "../models/Booking.js"; // Booking model
import Car from "../models/Car.js"; // Car model

// @desc    Book a car
// @route   POST /api/bookings
// @access  Private
export const bookCar = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Find the car by ID
    const car = await Car.findById(carId);

    // Check if car exists and is available
    if (!car || car.isBooked) {
      return res.status(400).json({ message: "Car is unavailable" });
    }

    // Validate car price
    if (isNaN(car.pricePerDay) || car.pricePerDay <= 0) {
      return res.status(400).json({ message: "Invalid car price" });
    }

    // Parse and validate booking dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }

    // Calculate total number of days
    const totalDays = Math.ceil(
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24)
    );

    // Validate totalDays
    if (totalDays <= 0) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Calculate total price for booking
    const totalPrice = totalDays * car.pricePerDay;

    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid price calculation" });
    }

    // Create and save booking
    const booking = new Booking({
      car: carId,
      user: req.user._id,
      startDate: startDateObj,
      endDate: endDateObj,
      totalPrice,
    });

    await booking.save();

    // Update car status to booked
    car.isBooked = true;
    car.bookedBy = req.user._id;
    await car.save();

    // Return success response
    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};
