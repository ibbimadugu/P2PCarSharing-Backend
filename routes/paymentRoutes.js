import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/orders.js";
import paypal from "../config/paypal.js";

const router = express.Router();

// Capture PayPal order and update DB
router.post("/capture-order", async (req, res) => {
  const { orderID, bookingId } = req.body;

  if (!orderID || !bookingId) {
    return res
      .status(400)
      .json({ error: "Order ID and Booking ID are required" });
  }

  try {
    const request = new paypal.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // ✅ Capture the payment
    const capture = await paypal.client().execute(request);

    const paymentDetails = {
      id: capture.result.id,
      status: capture.result.status,
      update_time: capture.result.update_time,
      email_address: capture.result?.payer?.email_address || null,
    };

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

      // ✅ Update Order record
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
    console.error(
      "❌ Error capturing PayPal order:",
      err?.response?.data || err
    );
    res.status(500).json({ error: "Unable to capture PayPal payment" });
  }
});

// Capture PayPal order and update DB
router.post("/capture-order", async (req, res) => {
  const { orderID, bookingId } = req.body;

  if (!orderID || !bookingId) {
    return res
      .status(400)
      .json({ error: "Order ID and Booking ID are required" });
  }

  try {
    const request = new paypal.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // ✅ FIXED: Use the correct PayPal client
    const capture = await paypal.client().execute(request);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found during capture" });
    }

    // Mark booking as paid
    booking.paid = true;
    await booking.save();

    // Update Order record
    const order = await Order.findOne({ bookingId });
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: capture.result.id,
        status: capture.result.status,
        update_time: capture.result.update_time,
        email_address: capture.result?.payer?.email_address || null,
      };
      await order.save();
    }

    res.json({ message: "Payment successful", details: capture.result });
  } catch (err) {
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

    res.json({ orders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Unable to fetch orders" });
  }
});

// Fetch Order by Booking ID
router.get("/orders/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required" });
  }

  try {
    // Find the order by bookingId
    const order = await Order.findOne({ bookingId });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Unable to fetch order" });
  }
});

export default router;
