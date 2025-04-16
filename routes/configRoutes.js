import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID_SANDBOX;
  res.json({ clientId });
});

export default router;
