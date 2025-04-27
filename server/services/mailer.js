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

export const sendQRCodeEmail = async (
  reference,
  email,
  qrCodeDataUrl,
  qrCodeBuffer
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your QR Code is Ready!",
    attachDataUrls: true,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4CAF50;">🎉 Your Event Ticket</h2>
      <p>Hi <strong>${email}</strong>,</p>
      <p>Thank you for your payment. Your ticket is ready!</p>

      <div style="margin: 20px 0; text-align: center;">
        <img src="${qrCodeDataUrl}" alt="QR Code Ticket" style="width: 200px; height: 200px;"/>
      </div>

      <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
        <p><strong>Reference:</strong> ${reference}</p>
        <p><strong>Amount Paid:</strong> ₦500</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <p style="margin-top: 30px;">✅ Show the QR code above at the event entrance.</p>
      <p>📎 You can also download your QR code — it's attached as a file in this email.</p>

      <p style="margin-top: 40px;">See you soon! 🎉</p>
      <p>— The Event Team</p>
    </div>
    `,
    attachments: [
      {
        filename: `ticket-${reference}.png`,
        content: qrCodeBuffer,
        contentType: "image/png",
      },
    ],
  };

  try {
    console.log("sending email");
    await transporter.sendMail(mailOptions);
    console.log(`📧 QR Code email sent successfully to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
};
