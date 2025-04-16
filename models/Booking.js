// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  isPaid: { type: Boolean, default: false },
});

export default mongoose.model("Booking", bookingSchema);
