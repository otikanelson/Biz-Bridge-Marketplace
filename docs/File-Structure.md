# BizBridge Project File Structure

## Frontend Structure (`frontend/`)

```
frontend/
├── public/
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── cards/
│   │   │   └── ServiceCard.jsx
│   │   ├── common/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ImageUpload.jsx ✅ [EXISTS]
│   │   │   └── LoadingSpinner.jsx
│   │   ├── forms/
│   │   │   └── ServiceRequestForm.jsx ✅ [EXISTS]
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx
│   │   │   └── SearchFilters.jsx ✅ [EXISTS]
│   │   ├── modals/
│   │   │   └── ServiceReviewModal.jsx
│   │   └── pages/
│   │       ├── ContactUs.jsx
│   │       ├── Dashboard.jsx ✅ [EXISTS]
│   │       ├── FAQ.jsx
│   │       ├── Home.jsx
│   │       ├── JobSelection.jsx ✅ [EXISTS]
│   │       ├── LocationSelection.jsx ✅ [EXISTS]
│   │       ├── Login.jsx
│   │       ├── MyBookings.jsx ✅ [EXISTS]
│   │       ├── Mywork.jsx ✅ [EXISTS]
│   │       ├── NotFound.jsx
│   │       ├── PrivacyPolicy.jsx
│   │       ├── Profile.jsx
│   │       ├── ServiceRequestDetail.jsx
│   │       ├── ServiceRequestInbox.jsx ✅ [EXISTS]
│   │       ├── ServicesAdd.jsx ✅ [EXISTS]
│   │       ├── ServicesManagement.jsx
│   │       ├── ServiceSearch.jsx
│   │       ├── ServiceView.jsx ✅ [EXISTS]
│   │       ├── Signup.jsx
│   │       ├── TermsOfService.jsx
│   │       └── Unauthorized.jsx
│   ├── context/
│   │   └── AuthContext.jsx ✅ [EXISTS]
│   ├── services/ 📁 [FRONTEND API CALLS]
│   │   └── ServiceList.js ✅ [EXISTS]
│   │   └── Services.js ✅ [EXISTS - mentioned in your code]
│   │   └── ServiceRequests.js ❌ [MISSING - needs creation]
│   ├── styles/
│   │   └── index.css ✅ [EXISTS]
│   ├── utils/
│   │   ├── imageUtils.js ✅ [EXISTS]
│   │   ├── locationData.js ✅ [EXISTS]
│   │   └── validation.js ✅ [EXISTS]
│   ├── App.jsx ✅ [EXISTS]
│   └── main.jsx ✅ [EXISTS]
├── .env ✅ [EXISTS]
├── index.html ✅ [EXISTS]
├── package-lock.json ✅ [EXISTS]
├── package.json ✅ [EXISTS]
├── postcss.config.js ✅ [EXISTS]
├── tailwind.config.js ✅ [EXISTS]
└── vite.config.js ✅ [EXISTS]
```

## Backend Structure (`backend/`)

```
backend/
├── src/
│   ├── api/ 📁 [BACKEND API LOGIC - DON'T IMPORT TO FRONTEND]
│   │   ├── Bookings.js
│   │   ├── ServiceRequests.js
│   │   └── Services.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── profileController.js
│   │   ├── serviceController.js ✅ [EXISTS]
│   │   ├── serviceRequestController.js ✅ [EXISTS]
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── upload.js ✅ [EXISTS]
│   ├── models/
│   │   ├── booking.js ✅ [EXISTS]
│   │   ├── service.js ✅ [EXISTS]
│   │   ├── serviceRequest.js ✅ [EXISTS]
│   │   └── user.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── serviceRequestRoutes.js
│   │   ├── serviceRoutes.js ✅ [EXISTS]
│   │   └── userRoutes.js
│   ├── scripts/
│   │   ├── migrate.js
│   │   └── test-service-api.js
│   └── utils/
│       ├── contractGenerator.js
│       └── jwtUtils.js
├── uploads/
├── .env ✅ [EXISTS]
├── package-lock.json ✅ [EXISTS]
├── package.json ✅ [EXISTS]
└── server.js ✅ [EXISTS]
```

## Root Level Files

```
BizBridge-master/
├── frontend/ 📁
├── backend/ 📁
├── Biz-Bridge Documentation.md ✅ [EXISTS]
├── Feature Plan.md ✅ [EXISTS]
├── Feature Strategy.md ✅ [EXISTS]
├── package-lock.json ✅ [EXISTS]
└── README.md ✅ [EXISTS]
```

## Import Rules & Conventions

### ✅ Correct Frontend Imports:
```javascript
// Components
import ImageUpload from '../components/common/ImageUpload';
import JobSelection from '../components/pages/JobSelection';
import LocationSelection from '../components/pages/LocationSelection';
import ServiceRequestForm from '../components/forms/ServiceRequestForm';

// Context
import { useAuth } from '../context/AuthContext';

// Services (Frontend API calls)
import { createService, getServiceById } from '../services/Services';

// Utils
import { validateForm } from '../utils/validation';
import { formatImage } from '../utils/imageUtils';
```

### ❌ NEVER Import from Backend:
```javascript
// ❌ WRONG - Never do this
import { createServiceRequest } from '../../../../backend/src/api/ServiceRequests';
import { serviceController } from '../../../../backend/src/controllers/serviceController';
```

### ✅ Correct Communication Pattern:
```
Frontend Component 
    ↓ calls
Frontend Service (e.g., services/Services.js)
    ↓ makes HTTP request to
Backend Route (e.g., /api/services)
    ↓ calls
Backend Controller
    ↓ uses
Backend Model
```

## Missing Files That Need Creation:

1. **`frontend/src/services/ServiceRequests.js`** - Frontend API calls for service requests
2. **`frontend/src/components/common/BookingForm.jsx`** - For Day 8 implementation
3. **`frontend/src/data/jobCategories.js`** - Job categories data (if needed)

## Notes:

- **Frontend `services/` folder**: Contains frontend API call functions that make HTTP requests to backend
- **Backend `api/` folder**: Contains backend business logic (DO NOT import to frontend)
- **Communication**: Always use HTTP requests between frontend and backend
- **File Paths**: All frontend imports should be relative within the `frontend/src/` directory