// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import configRoutes from "./routes/configRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// 🛡️ Middleware
// ======================
app.use(
  cors({
    origin: isDev
      ? "http://localhost:5173"
      : "https://p2pcarsharing.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// ======================
// 📂 Static Files
// ======================
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// 🔗 API Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/config/paypal", configRoutes);

// ======================
// ⚡ DB Connection & Server Start
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () =>
      console.log(`🚀 Server is running on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
