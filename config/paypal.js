import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export default {
  client,
  OrdersCreateRequest: checkoutNodeJssdk.orders.OrdersCreateRequest,
  OrdersCaptureRequest: checkoutNodeJssdk.orders.OrdersCaptureRequest,
};
