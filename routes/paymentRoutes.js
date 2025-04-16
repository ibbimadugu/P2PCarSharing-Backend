import express from "express";
import paypal from "../config/paypal.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// Helper to get PayPal client
const paypalClient = paypal.client();

// =======================
// CREATE PAYPAL ORDER
// =======================
router.post("/create-order", async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const request = new paypal.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: booking.totalPrice.toFixed(2),
          },
        },
      ],
    });

    const order = await paypalClient.execute(request);

    res.status(201).json({ orderID: order.result.id });
  } catch (err) {
    console.error("Error creating PayPal order:", err);
    res.status(500).json({ error: "Unable to create PayPal order" });
  }
});

// =======================
// CAPTURE PAYPAL ORDER
// =======================
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

    const capture = await paypalClient.execute(request);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found during capture" });
    }

    booking.paid = true;
    await booking.save();

    res.json({ message: "Payment successful", details: capture.result });
  } catch (err) {
    console.error("Error capturing PayPal order:", err);
    res.status(500).json({ error: "Unable to capture PayPal payment" });
  }
});

export default router;
