// bookingRoutes.js
import express from "express";
import { protect } from "../src/middleware/authMiddleware.js";
import {
  bookService,
  getArtisanBookings,
} from "../src/controllers/bookingController.js";

const router = express.Router();

// Route: Customer books an artisan's service
router.post("/book", protect, bookService);

// Route: Get all bookings for a specific artisan
router.get("/artisan", protect, getArtisanBookings);

export default router;
