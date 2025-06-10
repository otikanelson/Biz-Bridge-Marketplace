// backend/src/controllers/serviceRequestController.js
import ServiceRequest from '../models/serviceRequest.js';
import Service from '../models/service.js';
import User from '../models/user.js';
import Booking from '../models/booking.js';

// ========== CUSTOMER ENDPOINTS ==========

// @desc    Create a new service request
// @route   POST /api/service-requests
// @access  Private (Customer only)
export const createServiceRequest = async (req, res) => {
  try {
    const customerId = req.user._id;
    
    // Validate customer role
    if (req.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Only customers can create service requests'
      });
    }

    const {
      artisanId,
      serviceId,
      title,
      description,
      category,
      budget,
      timeline,
      location,
      requirements,
      priority,
      source
    } = req.body;

    // Validate required fields
    if (!artisanId || !title || !description || !category || !budget?.min || !timeline?.preferredStartDate || !location?.lga) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: artisanId, title, description, category, budget.min, timeline.preferredStartDate, location.lga'
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

    // Validate service exists if provided
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service || !service.isActive || service.artisan.toString() !== artisanId) {
        return res.status(404).json({
          success: false,
          message: 'Service not found or does not belong to the specified artisan'
        });
      }
    }

    // Check for duplicate active requests
    const existingRequest = await ServiceRequest.findOne({
      customer: customerId,
      artisan: artisanId,
      status: { $in: ['pending', 'viewed', 'negotiating', 'quoted', 'accepted'] },
      ...(serviceId && { service: serviceId })
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active request with this artisan for this service'
      });
    }

    // Create service request
    const serviceRequest = new ServiceRequest({
      customer: customerId,
      artisan: artisanId,
      service: serviceId || null,
      title,
      description,
      category,
      budget,
      timeline,
      location: {
        ...location,
        city: 'Lagos',
        state: 'Lagos'
      },
      requirements: requirements || {},
      priority: priority || 'medium',
      source: source || 'direct_service'
    });

    await serviceRequest.save();

    // Populate the response
    await serviceRequest.populate([
      { path: 'customer', select: 'fullName email profileImage' },
      { path: 'artisan', select: 'contactName businessName profileImage' },
      { path: 'service', select: 'title category price' }
    ]);

    console.log(`✅ Service request created: ${serviceRequest._id} from ${req.user.fullName} to ${artisan.contactName}`);

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      serviceRequest
    });

  } catch (error) {
    console.error('❌ Create service request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service request',
      error: error.message
    });
  }
};

// @desc    Get customer's service requests
// @route   GET /api/service-requests/my-requests
// @access  Private (Customer only)
export const getMyRequests = async (req, res) => {
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

    // Get requests with pagination
    const [requests, total] = await Promise.all([
      ServiceRequest.find(query)
        .populate([
          { path: 'artisan', select: 'contactName businessName profileImage location.lga' },
          { path: 'service', select: 'title category price images' },
          { path: 'booking', select: 'status scheduledDate pricing' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      ServiceRequest.countDocuments(query)
    ]);

    res.json({
      success: true,
      requests,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service requests',
      error: error.message
    });
  }
};

// @desc    Accept artisan's quote and convert to booking
// @route   POST /api/service-requests/:requestId/accept
// @access  Private (Customer only)
export const acceptQuote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const customerId = req.user._id;

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(requestId)
      .populate('artisan')
      .populate('service');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate ownership
    if (serviceRequest.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept your own service requests'
      });
    }

    // Validate status
    if (serviceRequest.status !== 'quoted') {
      return res.status(400).json({
        success: false,
        message: 'Can only accept quoted requests'
      });
    }

    // Validate artisan response exists
    if (!serviceRequest.artisanResponse.hasResponded || !serviceRequest.artisanResponse.proposedPrice?.amount) {
      return res.status(400).json({
        success: false,
        message: 'Artisan has not provided a valid quote'
      });
    }

    // Accept the quote
    await serviceRequest.acceptQuote();

    res.json({
      success: true,
      message: 'Quote accepted successfully. You can now convert this to a booking.',
      serviceRequest
    });

  } catch (error) {
    console.error('❌ Accept quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept quote',
      error: error.message
    });
  }
};

// @desc    Convert accepted request to booking
// @route   POST /api/service-requests/:requestId/convert-to-booking
// @access  Private (Customer only)
export const convertToBooking = async (req, res) => {
  try {
    const { requestId } = req.params;
    const customerId = req.user._id;
    const { scheduledDate, paymentTerms, depositAmount } = req.body;

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(requestId)
      .populate('artisan')
      .populate('service');

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate ownership
    if (serviceRequest.customer.toString() !== customerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only convert your own service requests'
      });
    }

    // Validate status
    if (serviceRequest.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only convert accepted requests to bookings'
      });
    }

    // Validate required booking data
    if (!scheduledDate?.startDate) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled start date is required'
      });
    }

    // Create the booking
    const booking = new Booking({
      customer: customerId,
      artisan: serviceRequest.artisan._id,
      service: serviceRequest.service._id,
      serviceRequest: serviceRequest._id,
      title: serviceRequest.title,
      description: serviceRequest.description,
      scheduledDate: {
        startDate: new Date(scheduledDate.startDate),
        endDate: scheduledDate.endDate ? new Date(scheduledDate.endDate) : null,
        startTime: scheduledDate.startTime || null,
        endTime: scheduledDate.endTime || null,
        duration: serviceRequest.artisanResponse.estimatedDuration || null
      },
      pricing: {
        agreedPrice: serviceRequest.artisanResponse.proposedPrice.amount,
        currency: serviceRequest.artisanResponse.proposedPrice.currency || 'NGN',
        breakdown: serviceRequest.artisanResponse.proposedPrice.breakdown || [],
        paymentTerms: paymentTerms || 'deposit_balance',
        depositAmount: depositAmount || 0
      },
      location: serviceRequest.location,
      source: 'service_request'
    });

    await booking.save();

    // Convert the service request
    await serviceRequest.convertToBooking(booking._id);

    // Populate booking response
    await booking.populate([
      { path: 'customer', select: 'fullName email profileImage' },
      { path: 'artisan', select: 'contactName businessName profileImage phoneNumber' },
      { path: 'service', select: 'title category images' }
    ]);

    console.log(`✅ Service request converted to booking: ${requestId} → ${booking._id}`);

    res.status(201).json({
      success: true,
      message: 'Service request successfully converted to booking',
      booking
    });

  } catch (error) {
    console.error('❌ Convert to booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert request to booking',
      error: error.message
    });
  }
};

// ========== ARTISAN ENDPOINTS ==========

// @desc    Get artisan's incoming service requests
// @route   GET /api/service-requests/inbox
// @access  Private (Artisan only)
export const getInbox = async (req, res) => {
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

    // Get requests with pagination
    const [requests, total] = await Promise.all([
      ServiceRequest.find(query)
        .populate([
          { path: 'customer', select: 'fullName email profileImage customerLocation' },
          { path: 'service', select: 'title category price images' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      ServiceRequest.countDocuments(query)
    ]);

    // Mark unread requests as viewed
    const unviewedRequests = requests.filter(req => req.status === 'pending');
    if (unviewedRequests.length > 0) {
      await ServiceRequest.updateMany(
        {
          _id: { $in: unviewedRequests.map(req => req._id) },
          status: 'pending'
        },
        { $set: { status: 'viewed' } }
      );
      
      // Update the requests in our response
      unviewedRequests.forEach(req => req.status = 'viewed');
    }

    res.json({
      success: true,
      requests,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('❌ Get inbox error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service requests',
      error: error.message
    });
  }
};

// @desc    Submit quote for service request
// @route   POST /api/service-requests/:requestId/quote
// @access  Private (Artisan only)
export const submitQuote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const artisanId = req.user._id;
    const {
      proposedPrice,
      estimatedDuration,
      proposedStartDate,
      proposedEndDate,
      counterOffer,
      termsAndConditions
    } = req.body;

    // Validate artisan role
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Only artisans can submit quotes'
      });
    }

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate ownership
    if (serviceRequest.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only quote your own service requests'
      });
    }

    // Validate status
    if (!['pending', 'viewed', 'negotiating'].includes(serviceRequest.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot quote this request in its current status'
      });
    }

    // Validate required quote data
    if (!proposedPrice?.amount || proposedPrice.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid proposed price is required'
      });
    }

    // Prepare quote data
    const quoteData = {
      proposedPrice: {
        amount: proposedPrice.amount,
        currency: proposedPrice.currency || 'NGN',
        breakdown: proposedPrice.breakdown || []
      },
      estimatedDuration,
      proposedStartDate: proposedStartDate ? new Date(proposedStartDate) : null,
      proposedEndDate: proposedEndDate ? new Date(proposedEndDate) : null,
      counterOffer,
      termsAndConditions
    };

    // Submit the quote
    await serviceRequest.submitQuote(quoteData);

    // Populate and return updated request
    await serviceRequest.populate([
      { path: 'customer', select: 'fullName email profileImage' },
      { path: 'service', select: 'title category price' }
    ]);

    console.log(`✅ Quote submitted for request: ${requestId} by ${req.user.contactName}`);

    res.json({
      success: true,
      message: 'Quote submitted successfully',
      serviceRequest
    });

  } catch (error) {
    console.error('❌ Submit quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote',
      error: error.message
    });
  }
};

// @desc    Decline service request
// @route   POST /api/service-requests/:requestId/decline
// @access  Private (Artisan only)
export const declineRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const artisanId = req.user._id;
    const { reason } = req.body;

    // Find the service request
    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate ownership
    if (serviceRequest.artisan.toString() !== artisanId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only decline your own service requests'
      });
    }

    // Validate status
    if (!['pending', 'viewed', 'negotiating', 'quoted'].includes(serviceRequest.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot decline this request in its current status'
      });
    }

    // Decline the request
    await serviceRequest.decline(reason);

    console.log(`✅ Service request declined: ${requestId} by ${req.user.contactName}`);

    res.json({
      success: true,
      message: 'Service request declined successfully'
    });

  } catch (error) {
    console.error('❌ Decline request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to decline request',
      error: error.message
    });
  }
};

// ========== SHARED ENDPOINTS ==========

// @desc    Get single service request details
// @route   GET /api/service-requests/:requestId
// @access  Private (Customer/Artisan - only involved parties)
export const getRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const serviceRequest = await ServiceRequest.findById(requestId)
      .populate([
        { path: 'customer', select: 'fullName email profileImage customerLocation' },
        { path: 'artisan', select: 'contactName businessName profileImage phoneNumber location' },
        { path: 'service', select: 'title category price images description' },
        { path: 'booking', select: 'status scheduledDate pricing' },
        { path: 'messages.sender', select: 'fullName contactName profileImage role' }
      ]);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate access - only involved parties can view
    const isCustomer = serviceRequest.customer._id.toString() === userId.toString();
    const isArtisan = serviceRequest.artisan._id.toString() === userId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own service requests'
      });
    }

    // Mark messages as read for the current user
    let hasUnreadMessages = false;
    serviceRequest.messages.forEach(message => {
      if (message.sender._id.toString() !== userId.toString() && !message.isRead) {
        message.isRead = true;
        hasUnreadMessages = true;
      }
    });

    if (hasUnreadMessages) {
      await serviceRequest.save();
    }

    res.json({
      success: true,
      serviceRequest,
      context: {
        isCustomer,
        isArtisan,
        canRespond: isArtisan && ['pending', 'viewed', 'negotiating'].includes(serviceRequest.status),
        canAccept: isCustomer && serviceRequest.status === 'quoted',
        canConvert: isCustomer && serviceRequest.status === 'accepted'
      }
    });

  } catch (error) {
    console.error('❌ Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve service request',
      error: error.message
    });
  }
};

// @desc    Add message to service request
// @route   POST /api/service-requests/:requestId/messages
// @access  Private (Customer/Artisan - only involved parties)
export const addMessage = async (req, res) => {
  try {
    const { requestId } = req.params;
    const senderId = req.user._id;
    const { message, attachments = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Validate access
    const isCustomer = serviceRequest.customer.toString() === senderId.toString();
    const isArtisan = serviceRequest.artisan.toString() === senderId.toString();

    if (!isCustomer && !isArtisan) {
      return res.status(403).json({
        success: false,
        message: 'You can only message in your own service requests'
      });
    }

    // Add the message
    await serviceRequest.addMessage(senderId, message.trim(), attachments);

    // Populate and return updated request
    await serviceRequest.populate('messages.sender', 'fullName contactName profileImage role');

    res.json({
      success: true,
      message: 'Message added successfully',
      newMessage: serviceRequest.messages[serviceRequest.messages.length - 1]
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

// ========== ADMIN/SYSTEM ENDPOINTS ==========

// @desc    Mark expired requests
// @route   POST /api/service-requests/mark-expired
// @access  Private (System/Admin)
export const markExpiredRequests = async (req, res) => {
  try {
    const result = await ServiceRequest.markExpiredRequests();
    
    console.log(`✅ Marked ${result.modifiedCount} requests as expired`);

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} requests as expired`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('❌ Mark expired requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark expired requests',
      error: error.message
    });
  }
};