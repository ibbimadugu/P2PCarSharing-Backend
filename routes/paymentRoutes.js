import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/orders.js";
import paypal from "../config/paypal.js";

const router = express.Router();

// Capture PayPal order and update Booking and Order in the database
router.post("/capture-order", async (req, res) => {
  const { orderID, bookingId } = req.body;

  // Check if both orderID and bookingId are provided
  if (!orderID || !bookingId) {
    return res
      .status(400)
      .json({ error: "Order ID and Booking ID are required" });
  }

  try {
    // Initialize the PayPal order capture request
    const request = new paypal.OrdersCaptureRequest(orderID);
    request.requestBody({}); // Empty body to just capture the payment

    // ✅ Capture the payment via PayPal API
    const capture = await paypal.client().execute(request);

    // Collect payment details from PayPal response
    const paymentDetails = {
      id: capture.result.id,
      status: capture.result.status,
      update_time: capture.result.update_time,
      email_address: capture.result?.payer?.email_address || null,
    };

    // If payment was successful, update the booking and order
    if (capture.result.status === "COMPLETED") {
      // ✅ Update Booking as paid
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paid: true,
          paidAt: new Date(),
          paymentResult: paymentDetails,
        },
        { new: true }
      );

      // ✅ Update the related Order record
      const order = await Order.findOne({ bookingId });
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = paymentDetails;
        await order.save();
      }

      return res.status(200).json({
        message: "Payment successful",
        booking: updatedBooking,
        order,
      });
    } else {
      return res.status(400).json({ error: "Payment not completed" });
    }
  } catch (err) {
    // Handle any errors that occurred during payment capture
    console.error(
      "❌ Error capturing PayPal order:",
      err?.response?.data || err
    );
    res.status(500).json({ error: "Unable to capture PayPal payment" });
  }
});

// Fetch All Orders
router.get("/orders", async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    // Send the fetched orders as the response
    res.json({ orders });
  } catch (err) {
    // Handle errors during order fetching
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Unable to fetch orders" });
  }
});

// Fetch Order by Booking ID
router.get("/orders/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  // Check if bookingId is provided in the URL params
  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required" });
  }

  try {
    // Find the order using the provided bookingId
    const order = await Order.findOne({ bookingId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Send the found order as the response
    res.json({ order });
  } catch (err) {
    // Handle errors during order fetching by bookingId
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Unable to fetch order" });
  }
});

export default router;
