import express from "express";
import { initializePayment, verifyPaymentAndGenerateQR } from "../controller/payment.controller";

const router = express.Router();

router.get('/initialize-payment', initializePayment);
router.post('/payment-callback', verifyPaymentAndGenerateQR);

export default router;