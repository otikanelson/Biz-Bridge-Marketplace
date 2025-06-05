// models/booking.js
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
  date: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);