// backend/src/controllers/bookingController.js - Enhanced version
import Booking from '../models/booking.js';
import Service from '../models/service.js';
import User from '../models/user.js';
import ServiceRequest from '../models/serviceRequest.js';

// ========== CUSTOMER ENDPOINTS ==========

// @desc    Create direct booking (without service request)
// @route   POST /api/bookings
// @access  Private (Customer only)
export const createDirectBooking = async (req, res) => {
  try {
    const customerId = req.user._id;
    
    // Validate customer role
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can create bookings'
      });
    }

    const {
      serviceId,
      artisanId,
      title,
      description,
      scheduledDate,
      pricing,
      location
    } = req.body;

    // Validate required fields
    if (!serviceId || !artisanId || !title || !scheduledDate?.startDate || !pricing?.agreedPrice || !location?.lga) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: serviceId, artisanId, title, scheduledDate.startDate, pricing.agreedPrice, location.lga'
      });
    }

    // Validate service exists and belongs to artisan
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive || service.artisan.toString() !== artisanId) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    // Validate artisan exists and is active
    const artisan = await User.findById(artisanId);
    if (!artisan || artisan.role !== 'artisan' || !artisan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found or inactive'
      });
    }

    // Create booking
    const booking = new Booking({
      customer: customerId,
      artisan: artisanId,
      service: serviceId,
      title,
      description: description || '',
      scheduledDate: {
        startDate: new Date(scheduledDate.startDate),
        endDate: scheduledDate.endDate ? new Date(scheduledDate.endDate) : null,
        startTime: scheduledDate.startTime || null,
        endTime: scheduledDate.endTime || null,
        duration: scheduledDate.duration || null
      },
      pricing: {
        agreedPrice: pricing.agreedPrice,
        currency: pricing.currency || 'NGN',
        breakdown: pricing.breakdown || [],
        paymentTerms: pricing.paymentTerms || 'deposit_balance',
        depositAmount: pricing.depositAmount || 0
      },
      location: {
        ...location,
        city: 'Lagos',
        state: 'Lagos'
      },
      source: 'direct_booking'
    });

    await booking.save();

    // Populate response
    await booking.populate([
      { path: 'customer', select: 'fullName email profileImage' },
      { path: 'artisan', select: 'contactName businessName profileImage phoneNumber' },
      { path: 'service', select: 'title category images price' }
    ]);

    console.log(`✅ Direct booking created: ${booking._id} by ${req.user.fullName}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('❌ Create direct booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
export const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Validate customer role
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can access this endpoint'
      });
    }

    // Build query
    const query = { customer: customerId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get bookings with pagination
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate([
          { path: 'artisan', select: 'contactName businessName profileImage phoneNumber location.lga' },
          { path: 'service', select: 'title category price images' },
          { path: 'serviceRequest', select: 'title status' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   POST /api/bookings/:bookingId/cancel
// @access  Private (Customer only - their own bookings)
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user._id;
    const { reason, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    // Validate status
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking in current status'
      });
    }

    // Cancel the booking
    await booking.cancel(customerId, reason || 'customer_request', description);

    console.log(`✅ Booking cancelled: ${bookingId} by customer`);

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// @desc    Add review for completed booking
// @route   POST /api/bookings/:bookingId/review
// @access  Private (Customer only)
export const addCustomerReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user._id;
    const { rating, comment, images = [] } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating (1-5) is required'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Validate status
    if (!['pending_review', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if already reviewed
    if (booking.review.customerReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Add review
    await booking.addReview('customer', rating, comment, images);

    console.log(`✅ Customer review added for booking: ${bookingId}`);

    res.json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('❌ Add customer review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// ========== ARTISAN ENDPOINTS ==========

// @desc    Get artisan's bookings
// @route   GET /api/bookings/my-work
// @access  Private (Artisan only)
export const getMyWork = async (req, res) => {
  try {
    const artisanId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Validate artisan role
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can access this endpoint'
      });
    }

    // Build query
    const query = { artisan: artisanId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get bookings with pagination
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate([
          { path: 'customer', select: 'fullName email profileImage customerLocation' },
          { path: 'service', select: 'title category price images' },
          { path: 'serviceRequest', select: 'title status' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query)
    ]);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get my work error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: error.message
    });
  }
};

// @desc    Confirm booking
// @route   POST /api/bookings/:bookingId/confirm
// @access  Private (Artisan only)
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const artisanId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only confirm your own bookings'
      });
    }

    // Validate status
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only confirm pending bookings'
      });
    }

    // Confirm the booking
    await booking.confirm();

    console.log(`✅ Booking confirmed: ${bookingId} by artisan`);

    res.json({
      success: true,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('❌ Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
      error: error.message
    });
  }
};

// @desc    Start work on booking
// @route   POST /api/bookings/:bookingId/start
// @access  Private (Artisan only)
export const startWork = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const artisanId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only start work on your own bookings'
      });
    }

    // Validate status
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Can only start work on confirmed bookings'
      });
    }

    // Start work
    await booking.startWork();

    console.log(`✅ Work started on booking: ${bookingId}`);

    res.json({
      success: true,
      message: 'Work started successfully'
    });

  } catch (error) {
    console.error('❌ Start work error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start work',
      error: error.message
    });
  }
};

// @desc    Complete work on booking
// @route   POST /api/bookings/:bookingId/complete
// @access  Private (Artisan only)
export const completeWork = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const artisanId = req.user._id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only complete your own bookings'
      });
    }

    // Validate status
    if (booking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete bookings that are in progress'
      });
    }

    // Complete work
    await booking.complete();

    console.log(`✅ Work completed on booking: ${bookingId}`);

    res.json({
      success: true,
      message: 'Work completed successfully. Waiting for customer review.'
    });

  } catch (error) {
    console.error('❌ Complete work error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete work',
      error: error.message
    });
  }
};

// @desc    Add artisan review for customer
// @route   POST /api/bookings/:bookingId/artisan-review
// @access  Private (Artisan only)
export const addArtisanReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const artisanId = req.user._id;
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating (1-5) is required'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Validate status
    if (!['pending_review', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if already reviewed
    if (booking.review.artisanReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this customer'
      });
    }

    // Add review
    await booking.addReview('artisan', rating, comment);

    console.log(`✅ Artisan review added for booking: ${bookingId}`);

    res.json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('❌ Add artisan review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// ========== SHARED ENDPOINTS ==========

// @desc    Get single booking details
// @route   GET /api/bookings/:bookingId
// @access  Private (Customer/Artisan - only involved parties)
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate([
        { path: 'customer', select: 'fullName email profileImage customerLocation' },
        { path: 'artisan', select: 'contactName businessName profileImage phoneNumber location' },
        { path: 'service', select: 'title category price images description' },
        { path: 'serviceRequest', select: 'title status' },
        { path: 'messages.sender', select: 'fullName contactName profileImage role' },
        { path: 'statusHistory.changedBy', select: 'fullName contactName role' }
      ]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access
    const isCustomer = booking.customer._id.toString() === userId.toString();
    const isArtisan = booking.artisan._id.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own bookings'
      });
    }

    // Mark messages as read for current user
    let hasUnreadMessages = false;
    booking.messages.forEach(message => {
      if (message.sender._id.toString() !== userId.toString() && !message.isRead) {
        message.isRead = true;
        hasUnreadMessages = true;
      }
    });

    if (hasUnreadMessages) {
      await booking.save();
    }

    res.json({
      success: true,
      booking,
      context: {
        isCustomer,
        isArtisan,
        canConfirm: isArtisan && booking.status === 'pending',
        canStart: isArtisan && booking.status === 'confirmed',
        canComplete: isArtisan && booking.status === 'in_progress',
        canCancel: (isCustomer || isArtisan) && ['pending', 'confirmed'].includes(booking.status),
        canReviewCustomer: isCustomer && ['pending_review', 'completed'].includes(booking.status) && !booking.review.customerReview,
        canReviewArtisan: isArtisan && ['pending_review', 'completed'].includes(booking.status) && !booking.review.artisanReview
      }
    });

  } catch (error) {
    console.error('❌ Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: error.message
    });
  }
};

// @desc    Add message to booking
// @route   POST /api/bookings/:bookingId/messages
// @access  Private (Customer/Artisan - only involved parties)
export const addMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const senderId = req.user._id;
    const { message, attachments = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access
    const isCustomer = booking.customer.toString() === senderId.toString();
    const isArtisan = booking.artisan.toString() === senderId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only message in your own bookings'
      });
    }

    // Add the message
    await booking.addMessage(senderId, message.trim(), attachments);

    // Populate and return updated booking
    await booking.populate('messages.sender', 'fullName contactName profileImage role');

    res.json({
      success: true,
      message: 'Message added successfully',
      newMessage: booking.messages[booking.messages.length - 1]
    });

  } catch (error) {
    console.error('❌ Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
};

// @desc    Add milestone to booking
// @route   POST /api/bookings/:bookingId/milestones
// @access  Private (Artisan only)
export const addMilestone = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const artisanId = req.user._id;
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Milestone title is required'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only add milestones to your own bookings'
      });
    }

    // Add milestone
    const milestoneData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null
    };

    await booking.addMilestone(milestoneData);

    res.json({
      success: true,
      message: 'Milestone added successfully',
      milestone: booking.milestones[booking.milestones.length - 1]
    });

  } catch (error) {
    console.error('❌ Add milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add milestone',
      error: error.message
    });
  }
};

// @desc    Update milestone
// @route   PUT /api/bookings/:bookingId/milestones/:milestoneId
// @access  Private (Artisan only)
export const updateMilestone = async (req, res) => {
  try {
    const { bookingId, milestoneId } = req.params;
    const artisanId = req.user._id;
    const updateData = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate ownership
    if (booking.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update milestones in your own bookings'
      });
    }

    // Update milestone
    await booking.updateMilestone(milestoneId, updateData);

    res.json({
      success: true,
      message: 'Milestone updated successfully'
    });

  } catch (error) {
    console.error('❌ Update milestone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
      error: error.message
    });
  }
};

// ========== ANALYTICS ENDPOINTS ==========

// @desc    Get booking analytics for artisan
// @route   GET /api/bookings/analytics
// @access  Private (Artisan only)
export const getBookingAnalytics = async (req, res) => {
  try {
    const artisanId = req.user._id;

    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can access booking analytics'
      });
    }

    // Get various analytics
    const [
      totalBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      upcomingBookings,
      overdueBookings,
      averageRating,
      totalRevenue
    ] = await Promise.all([
      Booking.countDocuments({ artisan: artisanId }),
      Booking.countDocuments({ artisan: artisanId, status: 'completed' }),
      Booking.countDocuments({ artisan: artisanId, status: 'cancelled' }),
      Booking.countDocuments({ artisan: artisanId, status: { $in: ['pending', 'confirmed'] } }),
      Booking.getUpcomingBookings(artisanId, 30),
      Booking.getOverdueBookings(artisanId),
      Booking.aggregate([
        { $match: { artisan: artisanId, 'review.customerReview.rating': { $exists: true } } },
        { $group: { _id: null, avgRating: { $avg: '$review.customerReview.rating' } } }
      ]),
      Booking.aggregate([
        { $match: { artisan: artisanId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$pricing.agreedPrice' } } }
      ])
    ]);

    const analytics = {
      overview: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0,
        cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings * 100).toFixed(1) : 0
      },
      performance: {
        averageRating: averageRating[0]?.avgRating ? averageRating[0].avgRating.toFixed(1) : 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        upcomingCount: upcomingBookings.length,
        overdueCount: overdueBookings.length
      },
      upcoming: upcomingBookings.slice(0, 5), // Next 5 upcoming bookings
      overdue: overdueBookings.slice(0, 5) // Top 5 overdue bookings
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('❌ Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking analytics',
      error: error.message
    });
  }
};