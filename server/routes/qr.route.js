import express from "express";
import { getQrCode } from "../controller/qr.controller.js";

const router = express.Router();

router.get("/get-qr", getQrCode);

export default router;