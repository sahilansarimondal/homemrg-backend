import express from "express";
import router from "./routes/index.js";
import { config } from "./config.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || config.port;

// connect to the database
connectDB();

// CORS Configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL || "http://localhost:5173", // Default to common frontend ports
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // If you need cookies/auth headers
// };

// Middleware
app.use(cors({ origin: "http://localhost:3004", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// roures
app.use("/api", router);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Express backend!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
