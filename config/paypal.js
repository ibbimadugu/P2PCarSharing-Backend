// config/paypal.js
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

function environment() {
  if (!clientId || !clientSecret) {
    console.error("❌ Missing PayPal credentials");
    process.exit(1);
  }

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Export everything as one object so it can be imported as `paypal`
export default {
  client,
  OrdersCreateRequest: checkoutNodeJssdk.orders.OrdersCreateRequest,
  OrdersCaptureRequest: checkoutNodeJssdk.orders.OrdersCaptureRequest,
};
