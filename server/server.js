import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import fs from "fs";
import path from "path";

import paymentRoutes from "./routes/payment.route.js";
import qrRoutes from "./routes/qr.route.js";
import { connectDB } from "./db/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(helmet());
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('common', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
// remember to handle exceptions here
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'log', 'access.log'), { flags: 'a' })
}));
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, max: 100
}));

app.use("/api/vo/home", (req, res) => {
  res.send("Working");
})
app.use("/api/v0/payment", paymentRoutes);
app.use("/api/v0", qrRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "🔍 Endpoint not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`)
});