// server/routes/configRoutes.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const clientId =
    process.env.PAYPAL_MODE === "live"
      ? process.env.PAYPAL_CLIENT_ID_LIVE
      : process.env.PAYPAL_CLIENT_ID_SANDBOX;

  res.json({ clientId });
});

export default router;
