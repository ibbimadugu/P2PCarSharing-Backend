import Car from "../models/Car.js"; // Car model

// @desc    Get all available cars
// @route   GET /api/cars
// @access  Public
export const getAllCars = async (req, res) => {
  try {
    // Fetch all cars and populate 'bookedBy' with user's name and email
    const cars = await Car.find().populate("bookedBy", "name email");
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};

// @desc    Add a new car
// @route   POST /api/cars
// @access  Private (owners only)
export const addCar = async (req, res) => {
  try {
    const { name, pricePerDay, location, imageUrl } = req.body;

    // Create new car entry
    const car = new Car({
      name,
      pricePerDay,
      location,
      image: imageUrl, // Use imageUrl from request body
      owner: req.user._id, // Set owner from authenticated user
    });

    const savedCar = await car.save();

    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ message: "Failed to add car" });
  }
};
