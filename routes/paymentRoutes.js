import express from "express";
import paypal from "../config/paypal.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// CREATE ORDER
router.post("/create-order", async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const request = new paypal.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "NGN",
            value: booking.totalPrice.toString(),
          },
        },
      ],
    });

    const order = await paypal.client().execute(request);
    res.status(201).json({ orderID: order.result.id });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Error creating PayPal order" });
  }
});

// CAPTURE ORDER
router.post("/capture-order", async (req, res) => {
  const { orderID, bookingId } = req.body;

  try {
    const request = new paypal.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await paypal.client().execute(request);

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.paid = true;
      await booking.save();
    }

    res.json({ message: "Payment successful", details: capture.result });
  } catch (err) {
    console.error("Error capturing order:", err);
    res.status(500).json({ error: "Payment failed" });
  }
});

export default router;
