import Car from "../models/Car.js";

// @desc    Get all available cars
// @route   GET /api/cars
// @access  Public
export const getAllCars = async (req, res) => {
  try {
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

    const car = new Car({
      name,
      pricePerDay,
      location,
      image,
      owner: req.user._id,
    });

    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ message: "Failed to add car" });
  }
};
