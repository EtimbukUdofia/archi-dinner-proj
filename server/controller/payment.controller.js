import axios from "axios";
import qrcode from "qrcode";
import { sendQRCodeEmail } from "../services/mailer.js";
import { QrCode } from "../model/QrCode.js";

export const initializePayment = async (req, res) => {
  const { email } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 5000,
        callback_url: `${process.env.BASE_URL}/api/v0/payment/payment-callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const authorizationURL = response.data.data.authorization_url;

    res.status(200).json({ authorization_url: authorizationURL });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to initialize payment" });
  }
};

export const verifyPaymentAndGenerateQR = async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?message=Missing%20Reference`);
  }

  console.log("passed");

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      }
    );

    if (response.data.data.status === 'success') {
      const email = response.data.data.customer.email;
      const uniqueCode = `QR-${reference}`;

      //Generate QR Code
      const qrCodeDataUrl = await qrcode.toDataURL(uniqueCode);

      // save QR to database
      const result = await QrCode.create({
        reference,
        email,
        qrCodeDataUrl,
      });

      // Send QR via Email
      // await sendQRCodeEmail(email, qrCodeDataUrl);

      console.log({ qrcode: qrCodeDataUrl });
      res.redirect(`${process.env.FRONTEND_URL}result.html?reference=${reference}`);
    } else {
      res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};
