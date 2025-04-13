import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

function environment() {
  const clientId =
    process.env.PAYPAL_MODE === "live"
      ? process.env.PAYPAL_CLIENT_ID_LIVE
      : process.env.PAYPAL_CLIENT_ID_SANDBOX;

  const clientSecret =
    process.env.PAYPAL_MODE === "live"
      ? process.env.PAYPAL_CLIENT_SECRET_LIVE
      : process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

  return process.env.PAYPAL_MODE === "live"
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export default { client };
