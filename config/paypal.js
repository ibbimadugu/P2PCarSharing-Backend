// config/paypal.js

// Import PayPal SDK and environment variable manager
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

// Retrieve PayPal credentials from environment variables
const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

// Set up PayPal environment (sandbox in this case)
function environment() {
  if (!clientId || !clientSecret) {
    console.error("❌ Missing PayPal credentials");
    process.exit(1); // Exit if credentials are missing
  }

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// Create a PayPal client instance
function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Export PayPal client and request classes
export default {
  client,
  OrdersCreateRequest: checkoutNodeJssdk.orders.OrdersCreateRequest,
  OrdersCaptureRequest: checkoutNodeJssdk.orders.OrdersCaptureRequest,
};
