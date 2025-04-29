import mongoose from "mongoose";
const { Schema } = mongoose;

const qrCodeSchema = new Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },

  firstName: {
    type: String,
    require: true
  },

  lastName: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
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