import express from "express";
import { initializePayment, verifyPaymentAndGenerateQR } from "../controller/payment.controller.js";

const router = express.Router();

router.post('/initialize-payment', initializePayment);
router.get('/payment-callback', verifyPaymentAndGenerateQR);

export default router;