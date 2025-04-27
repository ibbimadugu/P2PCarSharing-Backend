import * as paypal from "@paypal/checkout-server-sdk"; // PayPal SDK
import dotenv from "dotenv";
dotenv.config();

// Create and return PayPal sandbox environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

  if (!clientId || !clientSecret) {
    console.error("❌ Missing PayPal credentials");
    process.exit(1);
  }

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Create and return a PayPal HTTP client
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// @desc    Create a PayPal order
// @route   POST /api/create-order
// @access  Private
export const createOrder = async (req, res) => {
  console.log("🔔 /create-order route hit");

  const request = new paypal.orders.OrdersCreateRequest();
  request.headers["Prefer"] = "return=representation"; // Request full order representation in response

  // Build the order request body
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "10.00", // Hardcoded amount for testing
        },
      },
    ],
  });

  try {
    // Execute the order creation request
    const order = await client().execute(request);
    console.log("✅ PayPal order created:", order.result.id);

    res.status(201).json({ orderID: order.result.id });
  } catch (err) {
    console.error("❌ PayPal order creation failed:", err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
};
