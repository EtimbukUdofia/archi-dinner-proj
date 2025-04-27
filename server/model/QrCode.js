import mongoose from "mongoose";
const { Schema } = mongoose;

const qrCodeSchema = new Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
  },

  qrCodeDataUrl: {
    type: String,
    required: true
  }
}, { timestamps: true })

export const QrCode = mongoose.model("QrCode", qrCodeSchema);