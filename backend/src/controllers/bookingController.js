// backend/src/controllers/bookingController.js - Complete No-Payment System
import Booking from '../models/booking.js';
import Service from '../models/service.js';
import User from '../models/user.js';
import ServiceRequest from '../models/serviceRequest.js';
import { generateEnhancedContract, validateContractAcceptance } from '../utils/contractGenerator.js';
import fs from 'fs';
import path from 'path';

// ========== CUSTOMER ENDPOINTS ==========

// @desc    Get customer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer only)
export const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { status, limit = 20, page = 1 } = req.query;

    const bookings = await Booking.getBookingHistory(customerId, 'customer', limit);

    // Filter by status if provided
    const filteredBookings = status ? 
      bookings.filter(booking => booking.status === status) : 
      bookings;

    // Add contract status to each booking
    const bookingsWithContext = filteredBookings.map(booking => ({
      ...booking.toObject(),
      contractStatus: {
        customerAccepted: booking.agreement.contractAccepted.customer,
        artisanAccepted: booking.agreement.contractAccepted.artisan,
        bothAccepted: booking.agreement.bothPartiesAccepted,
        pendingContractAcceptance: !booking.agreement.bothPartiesAccepted
      },
      canComplete: booking.status === 'in_progress',
      canCancel: ['in_progress'].includes(booking.status),
      hasDispute: booking.dispute.isDisputed
    }));

    res.json({
      success: true,
      count: filteredBookings.length,
      bookings: bookingsWithContext
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
// @access  Private (Customer/Artisan)
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const { reason, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access
    const isCustomer = booking.customer.toString() === userId.toString();
    const isArtisan = booking.artisan.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    // Check if booking can be cancelled
    if (!['in_progress'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled in its current status'
      });
    }

    // Validate required fields
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    // Cancel the booking
    await booking.cancel(userId, reason, description);

    console.log(`✅ Booking cancelled: ${bookingId} by ${req.user.fullName || req.user.contactName}`);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
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

// @desc    Mark booking as completed (CUSTOMER ONLY)
// @route   POST /api/bookings/:bookingId/complete
// @access  Private (Customer only)
export const markBookingComplete = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const customerId = req.user._id;
    const { rating, review } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('artisan', 'contactName businessName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate customer ownership
    if (booking.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the customer can mark a booking as complete'
      });
    }

    // Check if booking can be completed
    if (booking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be in progress to be marked as complete'
      });
    }

    // Mark as completed
    await booking.markAsCompleted(customerId);

    // Add review if provided
    if (rating && review) {
      await booking.addReview('customer', rating, review);
    }

    console.log(`✅ Booking completed: ${bookingId} by customer`);

    res.json({
      success: true,
      message: 'Booking marked as completed successfully',
      booking
    });

  } catch (error) {
    console.error('❌ Mark booking complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark booking as complete',
      error: error.message
    });
  }
};

// ========== ARTISAN ENDPOINTS ==========

// @desc    Get artisan's bookings/work
// @route   GET /api/bookings/my-work
// @access  Private (Artisan only)
export const getMyWork = async (req, res) => {
  try {
    const artisanId = req.user._id;
    const { status, limit = 20 } = req.query;

    const bookings = await Booking.getBookingHistory(artisanId, 'artisan', limit);

    // Filter by status if provided
    const filteredBookings = status ? 
      bookings.filter(booking => booking.status === status) : 
      bookings;

    // Add context for artisan view
    const bookingsWithContext = filteredBookings.map(booking => ({
      ...booking.toObject(),
      contractStatus: {
        customerAccepted: booking.agreement.contractAccepted.customer,
        artisanAccepted: booking.agreement.contractAccepted.artisan,
        bothAccepted: booking.agreement.bothPartiesAccepted,
        pendingContractAcceptance: !booking.agreement.bothPartiesAccepted
      },
      canAcceptContract: !booking.agreement.contractAccepted.artisan,
      canCancel: ['in_progress'].includes(booking.status),
      hasDispute: booking.dispute.isDisputed,
      awaitingCustomerCompletion: booking.status === 'in_progress' && booking.agreement.bothPartiesAccepted
    }));

    res.json({
      success: true,
      count: filteredBookings.length,
      bookings: bookingsWithContext
    });

  } catch (error) {
    console.error('❌ Get my work error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve work bookings',
      error: error.message
    });
  }
};

// ========== CONTRACT MANAGEMENT ENDPOINTS ==========

// @desc    Get booking contract
// @route   GET /api/bookings/:bookingId/contract
// @access  Private (Customer/Artisan - involved parties only)
export const getBookingContract = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'fullName email phone')
      .populate('artisan', 'contactName businessName email phoneNumber location')
      .populate('service', 'title category pricing');

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
        message: 'You can only view contracts for your own bookings'
      });
    }

    // Generate enhanced contract if not already generated
    let contractData;
    if (!booking.agreement.contractText || !booking.agreement.contractVersion) {
      console.log('Generating enhanced contract...');
      contractData = await generateEnhancedContract(booking, booking.service);
    } else {
      contractData = {
        text: booking.agreement.contractText,
        version: booking.agreement.contractVersion,
        pdfUrl: booking.agreement.contractPDF?.url || null
      };
    }

    // Validate contract acceptance status
    const contractStatus = validateContractAcceptance(booking);

    res.json({
      success: true,
      contract: {
        text: contractData.text,
        version: contractData.version,
        pdfUrl: contractData.pdfUrl,
        generatedAt: booking.agreement.generatedAt,
        ...contractStatus,
        canAccept: isCustomer ? !contractStatus.customerAccepted : !contractStatus.artisanAccepted,
        userType: isCustomer ? 'customer' : 'artisan'
      }
    });

  } catch (error) {
    console.error('❌ Get booking contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contract',
      error: error.message
    });
  }
};

// @desc    Download booking contract as file
// @route   GET /api/bookings/:bookingId/contract/download
// @access  Private (Customer/Artisan - involved parties only)
export const downloadContractPDF = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'fullName email')
      .populate('artisan', 'contactName businessName')
      .populate('service', 'title category pricing');

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
        message: 'You can only download contracts for your own bookings'
      });
    }

    // Check if both parties have accepted the contract
    if (!booking.agreement.bothPartiesAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Contract must be accepted by both parties before downloading'
      });
    }

    // Generate contract file if not exists
    if (!booking.agreement.contractPDF) {
      const contractData = await generateEnhancedContract(booking, booking.service);
      if (!contractData.pdfUrl) {
        return res.status(500).json({
          success: false,
          message: 'Failed to generate contract file'
        });
      }
    }

    const contractPath = path.join(process.cwd(), 'uploads', 'contracts', booking.agreement.contractPDF.filename);
    
    if (!fs.existsSync(contractPath)) {
      return res.status(404).json({
        success: false,
        message: 'Contract file not found'
      });
    }

    // Determine file type and set appropriate headers
    const isTextFile = booking.agreement.contractPDF.filename.endsWith('.txt');
    const contentType = isTextFile ? 'text/plain' : 'application/pdf';
    const fileExtension = isTextFile ? 'txt' : 'pdf';

    // Set response headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="contract_${booking._id}.${fileExtension}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(contractPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('❌ Download contract file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download contract file',
      error: error.message
    });
  }
};

// @desc    Accept booking contract
// @route   POST /api/bookings/:bookingId/accept-contract
// @access  Private (Customer/Artisan - involved parties only)
export const acceptContract = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'fullName')
      .populate('artisan', 'contactName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access and determine user type
    const isCustomer = booking.customer._id.toString() === userId.toString();
    const isArtisan = booking.artisan._id.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept contracts for your own bookings'
      });
    }

    const userType = isCustomer ? 'customer' : 'artisan';

    // Check if user has already accepted
    if (booking.agreement.contractAccepted[userType]) {
      return res.status(400).json({
        success: false,
        message: 'You have already accepted this contract'
      });
    }

    // Accept the contract
    await booking.acceptContract(userId, userType);

    const message = booking.agreement.bothPartiesAccepted ? 
      'Contract accepted! Both parties have now accepted the contract terms.' :
      'Contract accepted! Waiting for the other party to accept.';

    console.log(`✅ Contract accepted: ${bookingId} by ${userType}`);

    res.json({
      success: true,
      message,
      contractStatus: {
        customerAccepted: booking.agreement.contractAccepted.customer,
        artisanAccepted: booking.agreement.contractAccepted.artisan,
        bothAccepted: booking.agreement.bothPartiesAccepted
      }
    });

  } catch (error) {
    console.error('❌ Accept contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept contract',
      error: error.message
    });
  }
};

// ========== DISPUTE MANAGEMENT ENDPOINTS ==========

// @desc    File a dispute
// @route   POST /api/bookings/:bookingId/dispute
// @access  Private (Customer/Artisan - involved parties only)
export const fileDispute = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const { reason, description } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access
    const isCustomer = booking.customer.toString() === userId.toString();
    const isArtisan = booking.artisan.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only file disputes for your own bookings'
      });
    }

    // Check if dispute already exists
    if (booking.dispute.isDisputed) {
      return res.status(400).json({
        success: false,
        message: 'A dispute has already been filed for this booking'
      });
    }

    // Validate required fields
    if (!reason || !description) {
      return res.status(400).json({
        success: false,
        message: 'Dispute reason and description are required'
      });
    }

    // File the dispute
    await booking.fileDispute(userId, reason, description);

    console.log(`✅ Dispute filed: ${bookingId} by ${isCustomer ? 'customer' : 'artisan'}`);

    res.json({
      success: true,
      message: 'Dispute filed successfully. BizBridge team will review and contact you soon.',
      dispute: {
        reason,
        description,
        filedAt: booking.dispute.filedAt,
        status: booking.dispute.status
      }
    });

  } catch (error) {
    console.error('❌ File dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to file dispute',
      error: error.message
    });
  }
};

// ========== SHARED ENDPOINTS ==========

// @desc    Get single booking details
// @route   GET /api/bookings/:bookingId
// @access  Private (Customer/Artisan - involved parties only)
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId)
      .populate([
        { path: 'customer', select: 'fullName email profileImage' },
        { path: 'artisan', select: 'contactName businessName profileImage phoneNumber' },
        { path: 'service', select: 'title category pricing images description' },
        { path: 'serviceRequest', select: 'title status selectedCategory' },
        { path: 'messages.sender', select: 'fullName contactName profileImage role' }
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

    // Mark messages as read
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

    // Add context for user actions
    const context = {
      isCustomer,
      isArtisan,
      canComplete: isCustomer && booking.status === 'in_progress',
      canCancel: ['in_progress'].includes(booking.status),
      canAcceptContract: isCustomer ? !booking.agreement.contractAccepted.customer : !booking.agreement.contractAccepted.artisan,
      canFileDispute: !booking.dispute.isDisputed,
      contractStatus: {
        customerAccepted: booking.agreement.contractAccepted.customer,
        artisanAccepted: booking.agreement.contractAccepted.artisan,
        bothAccepted: booking.agreement.bothPartiesAccepted
      }
    };

    res.json({
      success: true,
      booking,
      context
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
// @access  Private (Customer/Artisan - involved parties only)
export const addMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const senderId = req.user._id;
    const { message, attachments } = req.body;

    if (!message || message.trim().length === 0) {
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

    // Populate sender info for response
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

// @desc    Add review to booking
// @route   POST /api/bookings/:bookingId/review
// @access  Private (Customer/Artisan - involved parties only)
export const addReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Validate access
    const isCustomer = booking.customer.toString() === userId.toString();
    const isArtisan = booking.artisan.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You can only review completed bookings'
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const reviewerType = isCustomer ? 'customer' : 'artisan';
    
    // Check if user has already reviewed
    if (booking.review[`${reviewerType}Review`]?.rating) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    // Add the review
    await booking.addReview(reviewerType, rating, comment);

    console.log(`✅ Review added: ${bookingId} by ${reviewerType} - ${rating} stars`);

    res.json({
      success: true,
      message: 'Review added successfully',
      review: booking.review[`${reviewerType}Review`]
    });

  } catch (error) {
    console.error('❌ Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// ========== ADMIN ENDPOINTS ==========

// @desc    Get all disputed bookings
// @route   GET /api/bookings/admin/disputes
// @access  Private (Admin only)
export const getDisputedBookings = async (req, res) => {
  try {
    const disputedBookings = await Booking.getDisputedBookings();

    res.json({
      success: true,
      count: disputedBookings.length,
      bookings: disputedBookings
    });

  } catch (error) {
    console.error('❌ Get disputed bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve disputed bookings',
      error: error.message
    });
  }
};

// @desc    Resolve dispute
// @route   POST /api/bookings/:bookingId/resolve-dispute
// @access  Private (Admin only)
export const resolveDispute = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { resolutionNotes } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.dispute.isDisputed) {
      return res.status(400).json({
        success: false,
        message: 'No dispute found for this booking'
      });
    }

    // Resolve the dispute
    await booking.resolveDispute('admin', resolutionNotes);

    console.log(`✅ Dispute resolved: ${bookingId} by admin`);

    res.json({
      success: true,
      message: 'Dispute resolved successfully',
      resolution: booking.dispute.resolution
    });

  } catch (error) {
    console.error('❌ Resolve dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve dispute',
      error: error.message
    });
  }
};