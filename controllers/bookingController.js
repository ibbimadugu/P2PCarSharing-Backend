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

    // Validate car price
    if (isNaN(car.pricePerDay) || car.pricePerDay <= 0) {
      return res.status(400).json({ message: "Invalid car price" });
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Check if startDate and endDate are valid
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }

    // Calculate the number of days
    const totalDays = Math.ceil(
      (endDateObj - startDateObj) / (1000 * 60 * 60 * 24)
    );

    // Validate totalDays to be a positive number
    if (totalDays <= 0) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Calculate total price
    const totalPrice = totalDays * car.pricePerDay;

    // Validate totalPrice to be a valid number
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid price calculation" });
    }

    const booking = new Booking({
      car: carId,
      user: req.user._id,
      startDate: startDateObj,
      endDate: endDateObj,
      totalPrice,
    });

    await booking.save();

    car.isBooked = true;
    car.bookedBy = req.user._id;
    await car.save();

    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};
