import axios from "axios";
import qrcode from "qrcode";
import { sendQRCodeEmail } from "../services/mailer.js";
import { QrCode } from "../model/QrCode.js";

export const initializePayment = async (req, res) => {
  const { email, firstName, lastName, phone, department } = req.body;

  if (!email || !firstName || !lastName || !phone || !department) {
    return res.status(400).json({ success: false, message: "The Email, Firstname, Lastname, Phone Number and department are needed" });
  }

  const amount = process.env.PAYSTACK_AMOUNT;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: `${process.env.BASE_URL}/api/v0/payment/payment-callback`,
        metadata: {
          custom_fields: [
            {
              display_name: "First Name",
              variable_name: "firstName",
              value: firstName
            },
            {
              display_name: "Last Name",
              variable_name: "lastName",
              value: lastName
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: phone
            },
            {
              display_name: "Department",
              variable_name: "department",
              value: department
            },
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NODE_ENV === "development" ? process.env.PAYSTACK_SECRET_TEST : process.env.PAYSTACK_SECRET}`,
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
    return res.status(400).json({ success: false, message: "Reference is not provided" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${
            process.env.NODE_ENV === "development"
              ? process.env.PAYSTACK_SECRET_TEST
              : process.env.PAYSTACK_SECRET
          }`,
        },
      }
    );

    if (response.data.data.status === 'success') {
      const email = response.data.data.customer.email;
      const amount = ((response.data.data.amount)/100).toFixed(2);
      const metaData = response.data.data.metadata.custom_fields;

      const firstName = metaData.find(field => field.variable_name === "firstName")?.value || '';
      const lastName = metaData.find(field => field.variable_name === "lastName")?.value || '';
      const phone = metaData.find(field => field.variable_name === "phone")?.value || '';
      const department = metaData.find(field => field.variable_name === "department")?.value || '';
      
      const successPage = `${process.env.FRONTEND_URL}/result.html?reference=${reference}`;
      // const uniqueCode = `QR-${reference}`;

      //Generate QR Code
      const qrCodeDataUrl = await qrcode.toDataURL(successPage);
      const qrCodeBuffer = await qrcode.toBuffer(successPage);

      // save QR to database
      const result = await QrCode.create({
        reference,
        firstName,
        lastName,
        phoneNumber: phone,
        department,
        email,
        qrCodeDataUrl,
      });

      // Send QR via Email
      await sendQRCodeEmail(reference, firstName, lastName, email, amount, qrCodeDataUrl, qrCodeBuffer);

      res.redirect(successPage);
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
