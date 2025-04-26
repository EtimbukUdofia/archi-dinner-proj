import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import paymentRoutes from "./routes/payment.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

// remember to handle exceptions here
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'log', 'access.log'), { flags: 'a' })
}));

app.use("/api/v0/payment", paymentRoutes);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));