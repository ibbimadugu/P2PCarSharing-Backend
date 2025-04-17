import * as paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

  if (!clientId || !clientSecret) {
    console.error("❌ Missing PayPal credentials");
    process.exit(1);
  }

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

export const createOrder = async (req, res) => {
  console.log("🔔 /create-order route hit");

  // Correctly access the OrdersCreateRequest from the 'paypal' module
  const request = new paypal.orders.OrdersCreateRequest();
  request.headers["Prefer"] = "return=representation";

  // Correct way to use requestBody with an object
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "10.00", // hardcoded for now
        },
      },
    ],
  });

  try {
    const order = await client().execute(request);
    console.log("✅ PayPal order created:", order.result.id);
    res.status(201).json({ orderID: order.result.id });
  } catch (err) {
    console.error("❌ PayPal order creation failed:", err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
};
