import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendQRCodeEmail = async (email, qrCodeDataUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your QR Code is Ready!",
    attachDataUrls: true,
    html: `
      <p>Thank you for your payment!</p>
      <p>Here is your QR Code:</p>
      <img src="${qrCodeDataUrl}" alt="QR Code" />
    `,
  };

  try {
    console.log("sending email");
    await transporter.sendMail(mailOptions);
    console.log(
      `📧 QR Code email sent successfully to ${email}`
    );
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
};
