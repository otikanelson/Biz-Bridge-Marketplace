// bookingController.js
import Booking from '../models/booking.js';

// Customer books an artisan's service
export const bookService = async (req, res) => {
  try {
    const { serviceId, date } = req.body;
    const customerId = req.user._id;

    const booking = new Booking({
      customer: customerId,
      service: serviceId,
      artisan: req.body.artisanId,
      date
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for an artisan
export const getArtisanBookings = async (req, res) => {
  try {
    if (req.user.role !== "artisan") {
      return res.status(403).json({ message: "Only artisans can access their bookings." });
    }

    const bookings = await Booking.find({ artisan: req.user._id }).populate("customer", "fullName email");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};