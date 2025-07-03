// backend/src/controllers/serviceRequestController.js - Updated for No-Payment System
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
      source,
      selectedCategory // NEW: For categorized services
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

    // Validate service exists if provided and get pricing info
    let service = null;
    if (serviceId) {
      service = await Service.findById(serviceId);
      if (!service || !service.isActive || service.artisan.toString() !== artisanId) {
        return res.status(404).json({
          success: false,
          message: 'Service not found, inactive, or does not belong to specified artisan'
        });
      }

      // NEW: Validate selectedCategory for categorized services
      if (service.pricing.type === 'categorized') {
        if (!selectedCategory) {
          return res.status(400).json({
            success: false,
            message: 'Selected category is required for categorized pricing services'
          });
        }

        // Validate the selected category exists in the service
        const categoryExists = service.pricing.categories.some(cat => cat.name === selectedCategory);
        if (!categoryExists) {
          return res.status(400).json({
            success: false,
            message: `Selected category "${selectedCategory}" is not available for this service`
          });
        }
      } else if (selectedCategory) {
        return res.status(400).json({
          success: false,
          message: 'Selected category can only be provided for categorized pricing services'
        });
      }
    }

    // Create service request with enhanced pricing validation
    const serviceRequest = new ServiceRequest({
      customer: customerId,
      artisan: artisanId,
      service: serviceId,
      title,
      description,
      category,
      budget: {
        min: budget.min,
        max: budget.max || null,
        currency: budget.currency || 'NGN',
        isFlexible: budget.isFlexible !== false
      },
      timeline: {
        preferredStartDate: new Date(timeline.preferredStartDate),
        isFlexible: timeline.isFlexible !== false,
        urgency: timeline.urgency || 'medium'
      },
      location: {
        address: location.address,
        lga: location.lga,
        state: location.state || 'Lagos',
        coordinates: location.coordinates
      },
      requirements: requirements || {},
      priority: priority || 'medium',
      source: source || 'direct_service',
      selectedCategory: selectedCategory || null // NEW: Store selected category
    });

    await serviceRequest.save();

    // Populate and return
    await serviceRequest.populate([
      { path: 'customer', select: 'fullName email profileImage customerLocation' },
      { path: 'artisan', select: 'contactName businessName profileImage phoneNumber location' },
      { path: 'service', select: 'title category pricing images description' }
    ]);

    console.log(`✅ Service request created: ${serviceRequest._id} by ${req.user.fullName || req.user.contactName}`);

    // NEW: Add pricing context for response
    let pricingContext = null;
    if (service) {
      switch (service.pricing.type) {
        case 'fixed':
          pricingContext = {
            type: 'fixed',
            price: service.pricing.basePrice,
            duration: service.pricing.baseDuration,
            currency: service.pricing.currency
          };
          break;
        case 'negotiate':
          pricingContext = {
            type: 'negotiate',
            message: 'Price will be determined through negotiation'
          };
          break;
        case 'categorized':
          const selectedCat = service.pricing.categories.find(cat => cat.name === selectedCategory);
          pricingContext = {
            type: 'categorized',
            selectedCategory: selectedCategory,
            price: selectedCat?.price,
            duration: selectedCat?.duration,
            currency: service.pricing.currency
          };
          break;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      serviceRequest,
      pricingContext
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
    const { status, limit = 20, page = 1 } = req.query;

    // Build query
    const query = { customer: customerId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const serviceRequests = await ServiceRequest.find(query)
      .populate([
        { path: 'artisan', select: 'contactName businessName profileImage phoneNumber location ratings' },
        { path: 'service', select: 'title category pricing images' },
        { path: 'booking', select: 'status scheduledDate' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceRequest.countDocuments(query);

    // NEW: Add pricing context to each request
    const requestsWithPricing = serviceRequests.map(request => {
      const requestObj = request.toObject();
      
      // Add pricing information if service exists
      if (request.service && request.service.pricing) {
        switch (request.service.pricing.type) {
          case 'fixed':
            requestObj.pricingContext = {
              type: 'fixed',
              price: request.service.pricing.basePrice,
              duration: request.service.pricing.baseDuration,
              displayPrice: `₦${request.service.pricing.basePrice.toLocaleString()}`
            };
            break;
          case 'negotiate':
            requestObj.pricingContext = {
              type: 'negotiate',
              displayPrice: 'Price on consultation'
            };
            break;
          case 'categorized':
            if (request.selectedCategory) {
              const selectedCat = request.service.pricing.categories.find(cat => cat.name === request.selectedCategory);
              requestObj.pricingContext = {
                type: 'categorized',
                selectedCategory: request.selectedCategory,
                price: selectedCat?.price,
                duration: selectedCat?.duration,
                displayPrice: selectedCat ? `₦${selectedCat.price.toLocaleString()}` : 'Category not found'
              };
            }
            break;
        }
      }
      
      return requestObj;
    });

    res.json({
      success: true,
      count: serviceRequests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      serviceRequests: requestsWithPricing
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

// @desc    Accept artisan's quote
// @route   POST /api/service-requests/:requestId/accept
// @access  Private (Customer only)
export const acceptQuote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const customerId = req.user._id;

    const serviceRequest = await ServiceRequest.findById(requestId);

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
        message: 'You can only accept quotes for your own requests'
      });
    }

    // Validate status
    if (serviceRequest.status !== 'quoted') {
      return res.status(400).json({
        success: false,
        message: 'Can only accept requests that have been quoted'
      });
    }

    // Accept the quote
    await serviceRequest.acceptQuote();

    console.log(`✅ Quote accepted: ${requestId} by ${req.user.fullName}`);

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

// @desc    Convert accepted request to booking (NO PAYMENT VERSION)
// @route   POST /api/service-requests/:requestId/convert-to-booking
// @access  Private (Customer only)
export const convertToBooking = async (req, res) => {
  try {
    const { requestId } = req.params;
    const customerId = req.user._id;
    const { 
      scheduledDate, 
      meetingLocation,
      specialTerms
    } = req.body; // REMOVED: paymentTerms, depositAmount

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

    // NEW: Determine agreed pricing based on service type and selected category
    let agreedPricing = 'To be determined';
    if (serviceRequest.service && serviceRequest.artisanResponse?.hasResponded) {
      // Use artisan's response if available
      agreedPricing = `₦${serviceRequest.artisanResponse.quotedPrice.toLocaleString()}`;
    } else if (serviceRequest.service) {
      // Use service pricing information
      const service = serviceRequest.service;
      switch (service.pricing.type) {
        case 'fixed':
          agreedPricing = `₦${service.pricing.basePrice.toLocaleString()}`;
          break;
        case 'categorized':
          if (serviceRequest.selectedCategory) {
            const selectedCat = service.pricing.categories.find(cat => cat.name === serviceRequest.selectedCategory);
            if (selectedCat) {
              agreedPricing = `₦${selectedCat.price.toLocaleString()} for ${selectedCat.name}`;
            }
          }
          break;
        case 'negotiate':
          agreedPricing = 'To be negotiated';
          break;
      }
    }

    // Create the booking with NO PAYMENT FIELDS
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
        endTime: scheduledDate.endTime || null
      },
      // NEW: Agreement structure instead of payment
      agreement: {
        agreedTerms: {
          pricing: agreedPricing,
          duration: serviceRequest.artisanResponse?.estimatedDuration || serviceRequest.service?.pricing?.baseDuration || 'To be determined',
          meetingLocation: meetingLocation || serviceRequest.location?.address || 'To be determined',
          specialTerms: specialTerms || '',
          selectedCategory: serviceRequest.selectedCategory || null
        },
        contractAccepted: {
          customer: false,
          artisan: false,
          timestamps: {}
        },
        bothPartiesAccepted: false
      },
      location: serviceRequest.location,
      source: 'service_request',
      status: 'in_progress' // Start directly in progress
    });

    await booking.save();

    // Convert the service request
    await serviceRequest.convertToBooking(booking._id);

    // Populate booking response
    await booking.populate([
      { path: 'customer', select: 'fullName email profileImage' },
      { path: 'artisan', select: 'contactName businessName profileImage phoneNumber' },
      { path: 'service', select: 'title category pricing images' }
    ]);

    console.log(`✅ Service request converted to booking (no-payment): ${requestId} → ${booking._id}`);

    res.status(201).json({
      success: true,
      message: 'Service request successfully converted to booking. Contract acceptance is required from both parties.',
      booking: {
        ...booking.toObject(),
        nextSteps: [
          'Both parties need to review and accept the contract terms',
          'Meet at the agreed location to begin the service',
          'Customer can mark the booking as complete when satisfied'
        ]
      }
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
    const { status, limit = 20, page = 1 } = req.query;

    // Build query
    const query = { artisan: artisanId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const serviceRequests = await ServiceRequest.find(query)
      .populate([
        { path: 'customer', select: 'fullName email profileImage customerLocation' },
        { path: 'service', select: 'title category pricing images description' },
        { path: 'booking', select: 'status scheduledDate' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceRequest.countDocuments(query);

    // NEW: Add pricing context for artisan view
    const requestsWithPricing = serviceRequests.map(request => {
      const requestObj = request.toObject();
      
      // Add relevant pricing information for artisan
      if (request.service && request.service.pricing) {
        switch (request.service.pricing.type) {
          case 'fixed':
            requestObj.serviceInfo = {
              pricingType: 'fixed',
              price: request.service.pricing.basePrice,
              duration: request.service.pricing.baseDuration
            };
            break;
          case 'negotiate':
            requestObj.serviceInfo = {
              pricingType: 'negotiate',
              message: 'Quote required'
            };
            break;
          case 'categorized':
            requestObj.serviceInfo = {
              pricingType: 'categorized',
              selectedCategory: request.selectedCategory,
              availableCategories: request.service.pricing.categories
            };
            if (request.selectedCategory) {
              const selectedCat = request.service.pricing.categories.find(cat => cat.name === request.selectedCategory);
              if (selectedCat) {
                requestObj.serviceInfo.categoryPrice = selectedCat.price;
                requestObj.serviceInfo.categoryDuration = selectedCat.duration;
              }
            }
            break;
        }
      }
      
      return requestObj;
    });

    res.json({
      success: true,
      count: serviceRequests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      serviceRequests: requestsWithPricing
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

// @desc    Submit quote for service request (UPDATED FOR NO-PAYMENT)
// @route   POST /api/service-requests/:requestId/quote
// @access  Private (Artisan only)
export const submitQuote = async (req, res) => {
  try {
    const { requestId } = req.params;
    const artisanId = req.user._id;
    const {
      quotedPrice,
      estimatedDuration,
      message,
      proposedTimeline,
      workLocation,
      materials,
      terms
    } = req.body;

    const serviceRequest = await ServiceRequest.findById(requestId).populate('service');

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

    // NEW: Validate quote against service pricing type
    if (serviceRequest.service) {
      const service = serviceRequest.service;
      
      switch (service.pricing.type) {
        case 'fixed':
          // For fixed pricing, artisan can quote the same or different price
          if (!quotedPrice || quotedPrice <= 0) {
            return res.status(400).json({
              success: false,
              message: 'Quoted price is required for fixed pricing services'
            });
          }
          break;
          
        case 'categorized':
          // For categorized pricing, validate against selected category
          if (serviceRequest.selectedCategory) {
            const selectedCat = service.pricing.categories.find(cat => cat.name === serviceRequest.selectedCategory);
            if (selectedCat) {
              // Artisan can quote the category price or provide custom quote
              if (!quotedPrice || quotedPrice <= 0) {
                return res.status(400).json({
                  success: false,
                  message: `Quoted price is required. Suggested price for ${selectedCat.name}: ₦${selectedCat.price.toLocaleString()}`
                });
              }
            }
          }
          break;
          
        case 'negotiate':
          // For negotiate pricing, quote is mandatory
          if (!quotedPrice || quotedPrice <= 0) {
            return res.status(400).json({
              success: false,
              message: 'Quoted price is required for negotiated pricing services'
            });
          }
          break;
      }
    }

    // Validate required fields
    if (!quotedPrice || !estimatedDuration || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: quotedPrice, estimatedDuration, message'
      });
    }

    // Submit the quote
    await serviceRequest.submitQuote({
      quotedPrice: parseFloat(quotedPrice),
      estimatedDuration,
      message: message.trim(),
      proposedTimeline: proposedTimeline ? new Date(proposedTimeline) : null,
      workLocation: workLocation || 'To be discussed',
      materials: materials || 'Standard materials included',
      terms: terms || 'Standard terms apply'
    });

    console.log(`✅ Quote submitted: ${requestId} by ${req.user.contactName} - ₦${quotedPrice}`);

    res.json({
      success: true,
      message: 'Quote submitted successfully',
      quote: {
        quotedPrice: parseFloat(quotedPrice),
        estimatedDuration,
        message,
        submittedAt: new Date()
      }
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
        { path: 'service', select: 'title category pricing images description' },
        { path: 'booking', select: 'status scheduledDate agreement' },
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

    // NEW: Add comprehensive pricing context
    let pricingContext = null;
    if (serviceRequest.service && serviceRequest.service.pricing) {
      const service = serviceRequest.service;
      
      switch (service.pricing.type) {
        case 'fixed':
          pricingContext = {
            type: 'fixed',
            servicePrice: service.pricing.basePrice,
            serviceDuration: service.pricing.baseDuration,
            quotedPrice: serviceRequest.artisanResponse?.quotedPrice,
            finalPrice: serviceRequest.artisanResponse?.quotedPrice || service.pricing.basePrice,
            displayPrice: `₦${(serviceRequest.artisanResponse?.quotedPrice || service.pricing.basePrice).toLocaleString()}`
          };
          break;
        case 'negotiate':
          pricingContext = {
            type: 'negotiate',
            quotedPrice: serviceRequest.artisanResponse?.quotedPrice,
            finalPrice: serviceRequest.artisanResponse?.quotedPrice,
            displayPrice: serviceRequest.artisanResponse?.quotedPrice ? 
              `₦${serviceRequest.artisanResponse.quotedPrice.toLocaleString()}` : 'Awaiting quote'
          };
          break;
        case 'categorized':
          const selectedCat = service.pricing.categories.find(cat => cat.name === serviceRequest.selectedCategory);
          pricingContext = {
            type: 'categorized',
            selectedCategory: serviceRequest.selectedCategory,
            categoryPrice: selectedCat?.price,
            categoryDuration: selectedCat?.duration,
            quotedPrice: serviceRequest.artisanResponse?.quotedPrice,
            finalPrice: serviceRequest.artisanResponse?.quotedPrice || selectedCat?.price,
            displayPrice: serviceRequest.artisanResponse?.quotedPrice ? 
              `₦${serviceRequest.artisanResponse.quotedPrice.toLocaleString()}` :
              (selectedCat ? `₦${selectedCat.price.toLocaleString()}` : 'Price not determined')
          };
          break;
      }
    }

    // Mark as viewed if artisan is viewing for first time
    if (isArtisan && serviceRequest.status === 'pending') {
      await serviceRequest.markAsViewed();
    }

    res.json({
      success: true,
      serviceRequest,
      pricingContext,
      context: {
        isCustomer,
        isArtisan,
        canQuote: isArtisan && ['pending', 'viewed', 'negotiating'].includes(serviceRequest.status),
        canAccept: isCustomer && serviceRequest.status === 'quoted',
        canDecline: isArtisan && ['pending', 'viewed', 'negotiating', 'quoted'].includes(serviceRequest.status),
        canConvert: isCustomer && serviceRequest.status === 'accepted',
        canMessage: true
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
    const { message, attachments } = req.body;

    if (!message || message.trim().length === 0) {
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