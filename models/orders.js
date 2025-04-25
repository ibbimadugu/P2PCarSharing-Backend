import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Booking",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
