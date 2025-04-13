// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  title: String,
  image: String,
  pricePerDay: Number,
  location: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isBooked: { type: Boolean, default: false },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.model("Car", carSchema);
