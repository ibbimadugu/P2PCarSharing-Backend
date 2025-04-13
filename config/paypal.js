// config/paypal.js
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

// Export both client and SDK
export default {
  client,
  orders: checkoutNodeJssdk.orders,
};
