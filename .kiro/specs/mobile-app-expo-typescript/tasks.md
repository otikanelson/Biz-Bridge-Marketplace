# Implementation Plan: BizBridge Mobile Application

## Overview

This implementation plan breaks down the BizBridge mobile application into discrete, actionable tasks. The app is a TypeScript Expo cross-platform mobile application that provides feature parity with the existing web application while delivering a superior mobile user experience. All tasks build incrementally, with each phase validating functionality before moving forward.

## Tasks

- [x] 1. Project initialization and core setup
  - Initialize Expo project with TypeScript template in `mobile/` directory
  - Configure TypeScript with strict mode enabled
  - Install core dependencies (React Navigation, Axios, AsyncStorage, React Native Paper, Expo Vector Icons, Expo Image Picker, date-fns)
  - Set up project structure with directories: constants/, types/, theme/, components/, hooks/, screens/, navigation/, services/, utils/, context/, assets/
  - Configure app.json with app name, slug, version, and platform settings
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

- [x] 2. Constants and configuration
  - [x] 2.1 Create API configuration constants
    - Write `constants/api.ts` with API_CONFIG (BASE_URL, TIMEOUT, RETRY_ATTEMPTS) and API_ENDPOINTS for all backend routes
    - _Requirements: 30.1_
  
  - [x] 2.2 Create categories configuration
    - Write `constants/categories.ts` with all 26 JOB_CATEGORIES including id, name, description, icon, and color
    - Implement getCategoryById and getCategoryIcon helper functions
    - _Requirements: 30.2_
  
  - [x] 2.3 Create locations configuration
    - Write `constants/locations.ts` with all 20+ LAGOS_LGAS including localities
    - Implement getLocationById and getLocalitiesByLGA helper functions
    - _Requirements: 30.3, 30.4_
  
  - [x] 2.4 Create status constants
    - Write `constants/statuses.ts` with PRICING_TYPES, BOOKING_STATUSES, SERVICE_REQUEST_STATUSES, CANCELLATION_REASONS, DISPUTE_REASONS, and USER_ROLES
    - _Requirements: 30.5, 30.6, 30.7, 30.8, 30.9_

- [x] 3. TypeScript type system
  - [x] 3.1 Create data model types
    - Write `types/models.ts` with interfaces for User, Service, Booking, ServiceRequest, Review, PricingCategory, BookingMessage
    - _Requirements: 31.1, 31.2, 31.3, 31.4_
  
  - [x] 3.2 Create API types
    - Write `types/api.ts` with request/response types for all API operations
    - Include ApiResponse, ApiError, PaginatedResponse, LoginRequest, LoginResponse, RegisterCustomerRequest, RegisterArtisanRequest, SearchServicesParams, CreateServiceRequest, CreateBookingRequest, etc.
    - _Requirements: 31.8_
  
  - [x] 3.3 Create navigation types
    - Write `types/navigation.ts` with param lists for RootStackParamList, AuthStackParamList, CustomerTabParamList, ArtisanTabParamList, CustomerStackParamList, ArtisanStackParamList
    - _Requirements: 31.10_
  
  - [x] 3.4 Create theme types
    - Write `types/theme.ts` with ThemeColors, ThemeSpacing, ThemeTypography, Theme, and ThemeMode interfaces
    - _Requirements: 31.9_



- [x] 4. Theme system implementation
  - [x] 4.1 Create color palette
    - Write `theme/colors.ts` with COLORS object containing primary (red), secondary (black), neutral, and semantic colors
    - Define lightThemeColors and darkThemeColors configurations
    - _Requirements: 3.2, 35.10_
  
  - [x] 4.2 Create typography system
    - Write `theme/typography.ts` with FONT_FAMILIES, FONT_SIZES, and typography scale (h1-h6, body1-2, caption, button)
    - _Requirements: 35.5_
  
  - [x] 4.3 Create spacing system
    - Write `theme/spacing.ts` with spacing scale (xs, sm, md, lg, xl, xxl)
    - _Requirements: 35.2_
  
  - [x] 4.4 Create theme configurations
    - Write `theme/themes.ts` combining colors, typography, spacing, borderRadius, and shadows into lightTheme and darkTheme objects
    - _Requirements: 3.1, 3.2_
  
  - [x] 4.5 Create theme context and provider
    - Write `theme/ThemeContext.tsx` with ThemeProvider component and useTheme hook
    - Implement theme loading from AsyncStorage on app launch
    - Implement theme saving to AsyncStorage on change
    - Implement toggleTheme and setThemeMode functions
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 29.3_

- [x] 5. Utility functions
  - [x] 5.1 Create validation utilities
    - Write `utils/validation.ts` with functions for email, password, phone number, required fields, character limits, numeric, and date validation
    - _Requirements: 34.1, 34.2, 34.3, 34.4, 34.5, 34.6, 34.7_
  
  - [x] 5.2 Create formatting utilities
    - Write `utils/formatting.ts` with functions for price formatting (Nigerian Naira), date formatting, phone number formatting
    - _Requirements: 47.6, 47.7, 42.4, 42.5_
  
  - [x] 5.3 Create storage utilities
    - Write `utils/storage.ts` with AsyncStorage wrapper functions for storing/retrieving auth tokens, user data, and theme preferences
    - _Requirements: 29.1, 29.2, 29.7, 29.8_
  
  - [x] 5.4 Create helper utilities
    - Write `utils/helpers.ts` with general helper functions for image compression, debouncing, error message extraction
    - _Requirements: 51.5, 38.3_

- [x] 6. API service layer
  - [x] 6.1 Create Axios instance with interceptors
    - Write `services/api.ts` with configured Axios instance
    - Implement request interceptor to add Authorization header with JWT token
    - Implement response interceptor to handle 401 errors and trigger logout
    - Implement retry logic with exponential backoff for 5xx errors
    - _Requirements: 2.8, 2.9, 26.2, 52.3, 52.7, 72.1, 72.2, 72.3, 72.4, 72.5_
  
  - [x] 6.2 Create auth service
    - Write `services/auth.service.ts` with login, registerCustomer, registerArtisan, and getMe functions
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [x] 6.3 Create service service
    - Write `services/service.service.ts` with searchServices, getServiceById, getFeaturedServices, getMyServices, createService, updateService, deleteService, toggleServiceStatus functions
    - _Requirements: 4.2, 5.2, 6.2, 15.2, 16.9, 17.4, 58.3, 63.3_
  
  - [x] 6.4 Create booking service
    - Write `services/booking.service.ts` with getMyBookings, getMyWork, getBookingById, createBooking, completeBooking, cancelBooking, acceptContract, fileDispute, addMessage, getAnalytics, submitReview functions
    - _Requirements: 9.2, 12.2, 18.2, 19.2, 20.5, 59.4, 60.5, 40.5, 21.4, 21.5, 8.2_
  
  - [x] 6.5 Create service request service
    - Write `services/serviceRequest.service.ts` with getMyRequests, getInbox, getRequestById, createRequest, acceptRequest, declineRequest, retractRequest functions
    - _Requirements: 7.5, 10.2, 13.2, 14.5, 14.7, 61.3_
  
  - [x] 6.6 Create user service
    - Write `services/user.service.ts` with getProfile, updateProfile, changePassword, getUserById, getFeaturedArtisans, uploadImage functions
    - _Requirements: 22.2, 23.6, 64.5, 56.2, 57.1, 25.7_



- [x] 7. Custom hooks implementation
  - [x] 7.1 Create useAuth hook
    - Write `hooks/useAuth.ts` with state management for user, token, loading, error
    - Implement login, registerCustomer, registerArtisan, logout, refreshUser functions
    - Implement loadStoredAuth to check AsyncStorage on mount
    - Implement saveAuth and clearAuth for token/user persistence
    - _Requirements: 2.6, 2.7, 2.10, 29.1, 29.2, 29.4, 29.5, 29.7, 32.1, 32.7, 32.8, 32.9, 32.10_
  
  - [x] 7.2 Create useServices hook
    - Write `hooks/useServices.ts` with state management for services list, loading, error
    - Implement fetchServices, fetchServiceById, createService, updateService, deleteService, toggleServiceStatus functions
    - _Requirements: 32.2, 32.9, 32.10_
  
  - [x] 7.3 Create useBookings hook
    - Write `hooks/useBookings.ts` with state management for bookings list, loading, error
    - Implement fetchMyBookings, fetchMyWork, fetchBookingById, createBooking, completeBooking, cancelBooking, acceptContract, fileDispute, addMessage, submitReview functions
    - _Requirements: 32.3, 32.9, 32.10_
  
  - [x] 7.4 Create useServiceRequests hook
    - Write `hooks/useServiceRequests.ts` with state management for requests list, loading, error
    - Implement fetchMyRequests, fetchInbox, fetchRequestById, createRequest, acceptRequest, declineRequest, retractRequest functions
    - _Requirements: 32.4, 32.9, 32.10_
  
  - [x] 7.5 Create useProfile hook
    - Write `hooks/useProfile.ts` with state management for profile data, loading, error
    - Implement fetchProfile, updateProfile, changePassword, uploadProfileImage functions
    - _Requirements: 32.5, 32.9, 32.10_
  
  - [x] 7.6 Create useSearch hook
    - Write `hooks/useSearch.ts` with state management for search results, query, filters, loading, error
    - Implement debounced search with 500ms delay
    - Implement setSearchQuery, setFilters, clearFilters, search functions
    - _Requirements: 32.6, 38.3, 38.4, 51.3_

- [x] 8. Reusable UI components
  - [x] 8.1 Create Button component
    - Write `components/common/Button.tsx` with variants (primary, secondary, outline), sizes (small, medium, large), disabled and loading states
    - Apply theme colors and typography
    - Ensure minimum 44x44 touch target
    - _Requirements: 33.1, 33.11, 35.7, 50.2_
  
  - [x] 8.2 Create Card component
    - Write `components/common/Card.tsx` with elevation/shadow support and configurable padding
    - Apply theme colors and border radius
    - _Requirements: 33.2, 33.11, 35.7, 35.8_
  
  - [x] 8.3 Create Input component
    - Write `components/common/Input.tsx` with label, error display, focus states
    - Apply theme colors and typography
    - Support different keyboard types
    - _Requirements: 33.3, 33.11, 34.8, 78.3_
  
  - [x] 8.4 Create Picker component
    - Write `components/common/Picker.tsx` for dropdown selections
    - Apply theme colors
    - _Requirements: 33.4, 33.11_
  
  - [x] 8.5 Create LoadingSpinner component
    - Write `components/common/LoadingSpinner.tsx` with consistent styling
    - Apply theme colors
    - _Requirements: 33.8, 27.4_
  
  - [x] 8.6 Create ErrorMessage component
    - Write `components/common/ErrorMessage.tsx` with retry button option
    - Apply theme colors and typography
    - _Requirements: 33.9, 26.1, 26.9_
  
  - [x] 8.7 Create EmptyState component
    - Write `components/common/EmptyState.tsx` with icon/illustration, message, and optional action button
    - Apply theme colors
    - _Requirements: 33.10, 28.1, 28.2, 28.3, 28.4, 28.5, 28.6, 28.7_
  
  - [x] 8.8 Create ServiceCard component
    - Write `components/service/ServiceCard.tsx` displaying service image, title, category icon, artisan name, price, and location
    - Apply theme colors and handle touch interactions
    - _Requirements: 33.5, 5.8, 45.2, 45.3, 46.1, 47.1, 47.3, 47.4, 47.5, 47.8_
  
  - [x] 8.9 Create ServiceList component
    - Write `components/service/ServiceList.tsx` with FlatList rendering ServiceCard components
    - Implement pull-to-refresh
    - _Requirements: 41.1, 41.2, 41.3, 41.4, 41.5, 41.6_
  
  - [x] 8.10 Create ServiceGallery component
    - Write `components/service/ServiceGallery.tsx` with swipeable image gallery and indicators
    - Implement full-screen image viewer with pinch-to-zoom
    - _Requirements: 43.1, 43.2, 43.3, 43.4, 43.5, 43.6, 43.7, 43.8_
  
  - [x] 8.11 Create BookingCard component
    - Write `components/booking/BookingCard.tsx` displaying booking title, artisan/customer name, service, date, and status badge
    - Apply theme colors
    - _Requirements: 33.6, 9.4, 12.4, 48.1, 48.3, 48.4, 48.5, 48.6_
  
  - [x] 8.12 Create BookingList component
    - Write `components/booking/BookingList.tsx` with FlatList rendering BookingCard components grouped by status
    - Implement pull-to-refresh
    - _Requirements: 9.3, 12.3_
  
  - [x] 8.13 Create BookingStatus component
    - Write `components/booking/BookingStatus.tsx` displaying status badges with appropriate colors
    - _Requirements: 48.2, 48.10_
  
  - [x] 8.14 Create RequestCard component
    - Write `components/request/RequestCard.tsx` displaying request title, artisan/customer name, service, status, and date
    - Apply theme colors and status badges
    - _Requirements: 33.7, 10.4, 13.4, 48.7, 48.8, 48.9_
  
  - [x] 8.15 Create RequestList component
    - Write `components/request/RequestList.tsx` with FlatList rendering RequestCard components grouped by status
    - Implement pull-to-refresh
    - _Requirements: 10.3, 13.3_



- [x] 9. Authentication context and screens
  - [x] 9.1 Create AuthContext
    - Write `context/AuthContext.tsx` wrapping useAuth hook and providing auth state globally
    - _Requirements: 2.6, 2.7_
  
  - [x] 9.2 Create Login screen
    - Write `screens/auth/LoginScreen.tsx` with email and password inputs
    - Implement form validation and submission
    - Navigate to appropriate dashboard on success
    - Display error messages on failure
    - _Requirements: 2.1, 2.3, 2.7, 34.1, 34.2, 34.4, 34.9_
  
  - [x] 9.3 Create RegisterChoice screen
    - Write `screens/auth/RegisterChoiceScreen.tsx` with buttons for customer and artisan registration
    - _Requirements: 2.2_
  
  - [x] 9.4 Create RegisterCustomer screen
    - Write `screens/auth/RegisterCustomerScreen.tsx` with fullName, email, password, and location inputs
    - Implement form validation and submission
    - Navigate to customer dashboard on success
    - _Requirements: 2.4, 2.7, 34.4, 34.9_
  
  - [x] 9.5 Create RegisterArtisan screen
    - Write `screens/auth/RegisterArtisanScreen.tsx` with contactName, businessName, email, password, phoneNumber, and location inputs
    - Implement form validation and submission
    - Navigate to artisan dashboard on success
    - _Requirements: 2.5, 2.7, 34.3, 34.4, 34.9_
  
  - [x] 9.6 Create Onboarding screen
    - Write `screens/auth/OnboardingScreen.tsx` with 3-5 slides explaining key features
    - Implement Next, Skip, and Get Started buttons
    - Store onboarding completion in AsyncStorage
    - _Requirements: 71.1, 71.2, 71.3, 71.4, 71.5, 71.6, 71.7, 71.8_

- [ ] 10. Navigation setup
  - [x] 10.1 Create AuthNavigator
    - Write `navigation/AuthNavigator.tsx` with stack navigator for Onboarding, Login, RegisterChoice, RegisterCustomer, RegisterArtisan screens
    - _Requirements: 24.1, 24.5_
  
  - [x] 10.2 Create CustomerNavigator
    - Write `navigation/CustomerNavigator.tsx` with bottom tab navigator for Home, Search, Bookings, Requests, Profile
    - Create stack navigator for nested screens (ServiceDetails, ServiceRequest, BookingDetails, RequestDetails, ArtisanProfile, CreateBooking, EditProfile, ChangePassword, Help)
    - Configure tab icons using Ionicons
    - Apply theme colors to navigation
    - _Requirements: 24.2, 24.3, 24.5, 24.6, 24.7, 24.8_
  
  - [x] 10.3 Create ArtisanNavigator
    - Write `navigation/ArtisanNavigator.tsx` with bottom tab navigator for Home, MyWork, RequestInbox, MyServices, Profile
    - Create stack navigator for nested screens (ServiceDetails, AddService, EditService, BookingDetails, RequestDetails, EditProfile, ChangePassword, Help)
    - Configure tab icons using Ionicons
    - Apply theme colors to navigation
    - _Requirements: 24.2, 24.4, 24.5, 24.6, 24.7, 24.8_
  
  - [x] 10.4 Create AppNavigator (root)
    - Write `navigation/AppNavigator.tsx` with conditional rendering based on authentication state and user role
    - Implement loading screen while checking auth state
    - _Requirements: 24.1, 24.9, 29.4, 29.5, 29.6_
  
  - [x] 10.5 Configure deep linking
    - Write `navigation/linking.ts` with deep link configuration for services and artisan profiles
    - Handle unauthenticated deep link access
    - _Requirements: 54.1, 54.2, 54.3, 54.4, 54.5, 54.6, 54.7_

- [~] 11. Checkpoint - Core infrastructure complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Customer Home screen
  - [~] 12.1 Create HomeScreen component
    - Write `screens/customer/HomeScreen.tsx` with featured services section, search bar, and category grid
    - Fetch featured services on mount
    - Display loading, error, and empty states
    - Navigate to ServiceDetails on service tap
    - Navigate to Search with pre-selected category on category tap
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_
  
  - [~] 12.2 Add featured artisans section
    - Fetch and display featured artisans on home screen
    - Navigate to ArtisanProfile on artisan tap
    - _Requirements: 57.1, 57.2, 57.3, 57.4, 57.5, 57.6, 57.7_

- [ ] 13. Service search and browse
  - [~] 13.1 Create SearchScreen component
    - Write `screens/customer/SearchScreen.tsx` with search input, filter controls, sort options, and results list
    - Implement debounced search using useSearch hook
    - Display loading, error, and empty states
    - Navigate to ServiceDetails on service tap
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 38.1, 38.2, 38.4, 38.5, 38.6, 38.7, 38.8, 38.9, 38.10_
  
  - [~] 13.2 Implement filter functionality
    - Add filter modal/sheet with category, location, and pricing type filters
    - Display active filter indicators
    - Implement clear filters button
    - _Requirements: 39.1, 39.2, 39.3, 39.4, 39.5, 39.6, 39.7, 39.8, 39.9, 39.10_
  
  - [~] 13.3 Implement sort functionality
    - Add sort picker with options: Newest, Highest Rated, Most Reviews, Price Low-High, Price High-Low
    - Update results when sort option changes
    - _Requirements: 65.1, 65.2, 65.3, 65.4, 65.5, 65.6, 65.7, 65.8, 65.9_



- [ ] 14. Service details and request
  - [~] 14.1 Create ServiceDetailsScreen component
    - Write `screens/shared/ServiceDetailsScreen.tsx` displaying service images gallery, title, description, category, tags, pricing, artisan info, and locations
    - Fetch service details on mount
    - Display loading and error states
    - Show "Request Service" button for customers
    - Show "Edit Service" and "Delete Service" options for artisan viewing own service
    - Navigate to ServiceRequest on "Request Service" tap
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13, 67.6, 67.7_
  
  - [~] 14.2 Implement service deletion
    - Display confirmation dialog on delete tap
    - Call deleteService API on confirmation
    - Navigate back to services list on success
    - _Requirements: 58.1, 58.2, 58.3, 58.4, 58.5, 58.6, 58.7, 49.1, 49.6, 49.7_
  
  - [~] 14.3 Implement service sharing
    - Add share button to service details
    - Generate shareable message with deep link
    - Open native share dialog
    - _Requirements: 80.1, 80.2, 80.3, 80.4, 80.5, 80.7_
  
  - [~] 14.4 Create ServiceRequestScreen component
    - Write `screens/customer/ServiceRequestScreen.tsx` with title, description, preferred schedule, special requirements, and category selector (for categorized pricing)
    - Implement form validation
    - Submit request to API
    - Navigate to request history on success
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11_

- [ ] 15. Customer dashboard and bookings
  - [~] 15.1 Create customer dashboard
    - Write `screens/customer/DashboardScreen.tsx` (or enhance HomeScreen) with statistics cards showing active bookings, pending requests, completed bookings
    - Fetch analytics data
    - Display navigation buttons to bookings and requests
    - Display recent bookings list
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_
  
  - [~] 15.2 Create BookingsScreen component
    - Write `screens/customer/BookingsScreen.tsx` displaying bookings grouped by status with filter options
    - Fetch bookings on mount
    - Implement pull-to-refresh
    - Navigate to BookingDetails on booking tap
    - Display loading, error, and empty states
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [~] 15.3 Create RequestsScreen component
    - Write `screens/customer/RequestsScreen.tsx` displaying service requests grouped by status with filter options
    - Fetch requests on mount
    - Implement pull-to-refresh
    - Navigate to RequestDetails on request tap
    - Display loading, error, and empty states
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 16. Booking details and management
  - [~] 16.1 Create BookingDetailsScreen component
    - Write `screens/shared/BookingDetailsScreen.tsx` displaying booking info, service details, customer/artisan info, agreement terms, contract acceptance status, and messages
    - Fetch booking details on mount
    - Display loading and error states
    - Show role-appropriate action buttons
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.12, 18.13_
  
  - [~] 16.2 Implement booking messaging
    - Add message input field and send button
    - Display messages in chronological order with sender info
    - Distinguish customer and artisan messages visually
    - Auto-scroll to latest message
    - _Requirements: 18.10, 18.11, 40.1, 40.2, 40.3, 40.4, 40.5, 40.6, 40.7, 40.8, 40.9, 40.10_
  
  - [~] 16.3 Implement booking completion
    - Add "Mark as Completed" button for customers on in_progress bookings
    - Display confirmation dialog
    - Call complete API on confirmation
    - Prompt for review after completion
    - _Requirements: 18.9, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 49.2, 49.6, 49.7_
  
  - [~] 16.4 Implement booking cancellation
    - Add "Cancel Booking" button with cancellation form
    - Require cancellation reason selection
    - Call cancel API with reason
    - Update booking status on success
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 49.2, 49.6, 49.7_
  
  - [~] 16.5 Implement contract acceptance
    - Display contract terms and acceptance status
    - Add "Accept Contract" button when not accepted
    - Call accept contract API
    - Update UI on success
    - _Requirements: 59.1, 59.2, 59.3, 59.4, 59.5, 59.6, 59.7, 59.8_
  
  - [~] 16.6 Implement dispute filing
    - Add "File Dispute" button with dispute form
    - Require dispute reason and description
    - Call dispute API
    - Update booking status on success
    - _Requirements: 60.1, 60.2, 60.3, 60.4, 60.5, 60.6, 60.7, 60.8, 60.9_
  
  - [~] 16.7 Implement review submission
    - Create review form with star rating and optional comment
    - Validate rating (1-5) and comment length
    - Submit review to API
    - Display success message
    - Prevent duplicate reviews
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 21.10, 44.1, 44.2, 44.3, 44.4, 44.5, 44.6, 44.7_



- [ ] 17. Service request details and response
  - [~] 17.1 Create RequestDetailsScreen component
    - Write `screens/shared/RequestDetailsScreen.tsx` displaying request info, service details, customer/artisan info, status, and response
    - Fetch request details on mount
    - Display loading and error states
    - Show role-appropriate action buttons
    - _Requirements: 14.2_
  
  - [~] 17.2 Implement request acceptance (artisan)
    - Add "Accept" button for artisans on pending/viewed requests
    - Display response form with optional message and proposed terms
    - Submit acceptance to API
    - Update request status on success
    - _Requirements: 14.3, 14.4, 14.5, 14.8, 14.9, 14.10_
  
  - [~] 17.3 Implement request decline (artisan)
    - Add "Decline" button for artisans on pending/viewed requests
    - Display form requesting decline reason
    - Submit decline to API
    - Update request status on success
    - _Requirements: 14.3, 14.6, 14.7, 14.8, 14.9, 14.10, 49.3, 49.6, 49.7_
  
  - [~] 17.4 Implement request retraction (customer)
    - Add "Retract Request" button for customers on pending requests
    - Display confirmation dialog
    - Submit retraction to API
    - Update request status on success
    - _Requirements: 61.1, 61.2, 61.3, 61.4, 61.5, 61.6, 61.7_
  
  - [~] 17.5 Implement booking conversion
    - Add "Create Booking" button for customers on accepted requests
    - Navigate to CreateBookingScreen with pre-populated data
    - _Requirements: 62.1, 62.2, 62.3_
  
  - [~] 17.6 Create CreateBookingScreen component
    - Write `screens/customer/CreateBookingScreen.tsx` with booking form pre-populated from service request
    - Require scheduling information (start date, time)
    - Submit booking creation to API with service request ID
    - Update service request status to "converted" on success
    - Navigate to BookingDetails on success
    - _Requirements: 62.4, 62.5, 62.6, 62.7, 62.8, 62.9, 62.10_

- [~] 18. Checkpoint - Customer features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Artisan dashboard and work management
  - [~] 19.1 Create artisan dashboard
    - Write `screens/artisan/DashboardScreen.tsx` (or enhance HomeScreen) with statistics cards showing active bookings, pending requests, total services, average rating, total reviews
    - Fetch analytics data
    - Display navigation buttons to work, requests, and services
    - Display recent bookings list
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10, 66.1, 66.2, 66.3, 66.4, 66.5, 66.6, 66.7, 66.8, 66.9, 66.10_
  
  - [~] 19.2 Create MyWorkScreen component
    - Write `screens/artisan/MyWorkScreen.tsx` displaying artisan's bookings grouped by status with filter options
    - Fetch bookings on mount
    - Implement pull-to-refresh
    - Navigate to BookingDetails on booking tap
    - Display loading, error, and empty states
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9_
  
  - [~] 19.3 Create RequestInboxScreen component
    - Write `screens/artisan/RequestInboxScreen.tsx` displaying incoming service requests grouped by status with filter options
    - Fetch requests on mount
    - Highlight unread requests
    - Implement pull-to-refresh
    - Navigate to RequestDetails on request tap
    - Display loading, error, and empty states
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

- [ ] 20. Service management for artisans
  - [~] 20.1 Create MyServicesScreen component
    - Write `screens/artisan/MyServicesScreen.tsx` displaying artisan's services with images, title, category, pricing type, and active status
    - Fetch services on mount
    - Display "Add Service" button
    - Navigate to ServiceDetails on service tap
    - Navigate to AddService on "Add Service" tap
    - Display loading, error, and empty states
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10_
  
  - [~] 20.2 Create AddServiceScreen component
    - Write `screens/artisan/AddServiceScreen.tsx` with form for title, description, category, pricing type, pricing details, locations, tags, and images
    - Implement category picker with all 26 categories
    - Implement pricing type selector (fixed, negotiate, categorized)
    - Show conditional pricing fields based on type
    - Implement location selection for LGAs and localities
    - Implement tag input with removable chips
    - Implement image upload with multiple selection
    - Validate all required fields
    - Submit service creation to API
    - Navigate to ServiceDetails on success
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12, 16.13, 67.1, 67.2, 67.3, 67.4, 67.5, 67.8_
  
  - [~] 20.3 Create EditServiceScreen component
    - Write `screens/artisan/EditServiceScreen.tsx` with form pre-populated with existing service data
    - Allow editing of all service fields
    - Validate all required fields
    - Submit service update to API
    - Navigate back to ServiceDetails on success
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8_
  
  - [~] 20.4 Implement service status toggle
    - Add toggle switch in ServiceDetails for artisans viewing own service
    - Call toggle status API on change
    - Update UI to reflect new status
    - Display "Inactive" badge when service is inactive
    - _Requirements: 63.1, 63.2, 63.3, 63.4, 63.5, 63.6, 63.7_



- [ ] 21. Image upload functionality
  - [~] 21.1 Create image picker utility
    - Implement image selection from gallery using expo-image-picker
    - Implement image capture using camera
    - Display image preview before upload
    - Compress images before upload to reduce file size
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 51.5, 73.4, 73.5_
  
  - [~] 21.2 Implement image upload service
    - Create upload function in user service
    - Send images to /api/upload endpoint
    - Display upload progress indicator
    - Return image URL on success
    - Handle upload errors
    - _Requirements: 25.7, 25.8, 25.9, 25.10_
  
  - [~] 21.3 Integrate image upload in forms
    - Add image upload to service creation/editing forms (multiple images)
    - Add image upload to profile editing form (single image)
    - _Requirements: 25.5, 25.6_

- [ ] 22. Profile management
  - [~] 22.1 Create ProfileScreen component
    - Write `screens/profile/ProfileScreen.tsx` displaying profile image, username, email, role-specific info (fullName/location for customers, businessName/contactName/phoneNumber/specialties/ratings for artisans)
    - Fetch profile data on mount
    - Display "Edit Profile", "Change Password", "Logout", and theme toggle buttons
    - Display app version and build number
    - Display loading and error states
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10, 22.11, 69.1, 69.2_
  
  - [~] 22.2 Create EditProfileScreen component
    - Write `screens/profile/EditProfileScreen.tsx` with form pre-populated with current profile data
    - Allow editing role-specific fields
    - Implement profile image upload
    - Validate email and phone number formats
    - Submit profile update to API
    - Display success message on update
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 23.9, 23.10, 23.11_
  
  - [~] 22.3 Create ChangePasswordScreen component
    - Write `screens/profile/ChangePasswordScreen.tsx` with current password, new password, and confirm password inputs
    - Validate password length and matching
    - Submit password change to API
    - Display success message on change
    - Clear password fields after success
    - _Requirements: 64.1, 64.2, 64.3, 64.4, 64.5, 64.6, 64.7, 64.8, 64.9_
  
  - [~] 22.4 Implement logout functionality
    - Add logout button with confirmation dialog
    - Clear AsyncStorage on logout
    - Navigate to login screen
    - _Requirements: 2.10, 29.7, 49.4, 49.6, 49.7, 52.6_
  
  - [~] 22.5 Implement theme toggle
    - Add theme toggle switch in profile screen
    - Update theme immediately on toggle
    - Persist theme preference to AsyncStorage
    - _Requirements: 3.5, 3.6_

- [ ] 23. Artisan profile view
  - [~] 23.1 Create ArtisanProfileScreen component
    - Write `screens/shared/ArtisanProfileScreen.tsx` displaying artisan profile image, business name, contact name, location, specialties, experience, ratings, reviews, business info, social media links, and listed services
    - Fetch artisan profile on mount
    - Navigate to ServiceDetails on service tap
    - Display loading and error states
    - _Requirements: 56.1, 56.2, 56.3, 56.4, 56.5, 56.6, 56.7, 56.8, 56.9, 56.10, 56.11_

- [ ] 24. Help and support
  - [~] 24.1 Create HelpScreen component
    - Write `screens/profile/HelpScreen.tsx` with FAQs, contact information, terms of service link, privacy policy link, and bug report option
    - _Requirements: 70.1, 70.2, 70.3, 70.4, 70.5, 70.6_

- [ ] 25. Date and time pickers
  - [~] 25.1 Create date picker component
    - Implement date picker using native pickers for iOS and Android
    - Validate dates are not in the past
    - Format dates in user-friendly format
    - Apply theme colors
    - _Requirements: 42.1, 42.3, 42.4, 42.6, 42.7_
  
  - [~] 25.2 Create time picker component
    - Implement time picker using native pickers
    - Format times in 12-hour format with AM/PM
    - Apply theme colors
    - _Requirements: 42.2, 42.5, 42.6, 42.7_

- [ ] 26. Offline handling
  - [~] 26.1 Implement network detection
    - Detect when device loses internet connectivity
    - Display offline banner when offline
    - Hide banner when reconnected
    - _Requirements: 37.1, 37.2, 37.5_
  
  - [~] 26.2 Implement offline features
    - Disable network-dependent features when offline
    - Display cached data when available
    - Retry failed requests when reconnected
    - Provide manual refresh option
    - _Requirements: 37.3, 37.4, 37.6, 37.7_

- [ ] 27. Error handling and logging
  - [~] 27.1 Implement global error boundary
    - Create error boundary component to catch unhandled exceptions
    - Display user-friendly error screen
    - Log errors for debugging
    - _Requirements: 77.1_
  
  - [~] 27.2 Implement error logging
    - Log API request failures with status codes
    - Log authentication failures
    - Log navigation errors
    - Include timestamp and user context
    - Do not log sensitive information
    - _Requirements: 77.2, 77.3, 77.4, 77.5, 77.7, 77.8_
  
  - [~] 27.3 Enhance error messages
    - Display user-friendly error messages for different error types
    - Provide retry buttons for failed requests
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.7, 26.9_



- [ ] 28. Performance optimization
  - [~] 28.1 Implement lazy loading for images
    - Use lazy loading techniques for service and profile images
    - Display placeholder while loading
    - _Requirements: 51.1_
  
  - [~] 28.2 Implement API response caching
    - Cache featured services, categories, and locations
    - Implement cache invalidation strategy
    - _Requirements: 51.2_
  
  - [~] 28.3 Implement pagination
    - Add pagination to service search results
    - Add pagination to bookings and requests lists
    - _Requirements: 51.4_
  
  - [~] 28.4 Optimize React rendering
    - Use React.memo for expensive components
    - Use useMemo and useCallback hooks appropriately
    - Implement FlatList optimization (windowSize, maxToRenderPerBatch)
    - _Requirements: 51.6_
  
  - [~] 28.5 Implement skeleton screens
    - Create skeleton components for loading states
    - Display skeletons while fetching data
    - _Requirements: 27.5, 51.7_
  
  - [~] 28.6 Preload critical data
    - Preload user profile and featured services on app launch
    - _Requirements: 51.8_

- [ ] 29. Accessibility improvements
  - [~] 29.1 Add accessibility labels
    - Add accessibilityLabel to all interactive elements
    - Add accessibilityHint where appropriate
    - _Requirements: 50.1_
  
  - [~] 29.2 Ensure touch target sizes
    - Verify all interactive elements are at least 44x44 pixels
    - _Requirements: 50.2, 35.9_
  
  - [~] 29.3 Verify color contrast
    - Test color contrast ratios meet WCAG AA standards
    - Adjust colors if needed
    - _Requirements: 50.3, 35.11_
  
  - [~] 29.4 Add screen reader support
    - Test with VoiceOver (iOS) and TalkBack (Android)
    - Ensure proper reading order
    - _Requirements: 50.4_
  
  - [~] 29.5 Add image alt text
    - Provide accessibilityLabel for all images
    - _Requirements: 50.5_
  
  - [~] 29.6 Ensure form accessibility
    - Associate labels with form inputs
    - Provide clear error messages
    - _Requirements: 50.6_
  
  - [~] 29.7 Support dynamic font sizing
    - Test with different system font sizes
    - Ensure layouts adapt properly
    - _Requirements: 50.7_
  
  - [~] 29.8 Add focus indicators
    - Ensure focus indicators are visible for keyboard navigation
    - _Requirements: 50.9_

- [ ] 30. Responsive design testing
  - [~] 30.1 Test on different screen sizes
    - Test on small phones (320px width)
    - Test on standard phones (375px width)
    - Test on large phones (414px width)
    - Test on tablets (768px+ width)
    - _Requirements: 36.1, 36.2, 36.3, 36.4_
  
  - [~] 30.2 Verify flexible layouts
    - Ensure layouts scale properly with screen size
    - Verify responsive font sizes
    - Verify image scaling
    - Verify touch target accessibility
    - _Requirements: 36.5, 36.6, 36.7, 36.8_
  
  - [~] 30.3 Test on both platforms
    - Test on iOS devices
    - Test on Android devices
    - _Requirements: 36.9_

- [ ] 31. Security hardening
  - [~] 31.1 Implement input sanitization
    - Trim whitespace from all text inputs
    - Remove HTML tags from user-generated content
    - Escape special characters
    - _Requirements: 73.1, 73.2, 73.3_
  
  - [~] 31.2 Validate file uploads
    - Validate file types for image uploads
    - Validate file sizes (max 5MB)
    - _Requirements: 73.4, 73.5_
  
  - [~] 31.3 Prevent injection attacks
    - Sanitize search queries
    - Escape user-generated content before display
    - _Requirements: 73.6, 73.7_
  
  - [~] 31.4 Secure token storage
    - Ensure tokens are stored securely in AsyncStorage
    - Never log tokens or passwords
    - Clear sensitive data on logout
    - _Requirements: 52.1, 52.2, 52.6_
  
  - [~] 31.5 Use HTTPS for all requests
    - Verify all API requests use HTTPS
    - _Requirements: 52.3_
  
  - [~] 31.6 Validate all inputs
    - Validate all user inputs before submission
    - _Requirements: 52.4_

- [ ] 32. Keyboard handling
  - [~] 32.1 Implement keyboard dismissal
    - Dismiss keyboard when tapping outside input fields
    - _Requirements: 78.1_
  
  - [~] 32.2 Implement keyboard avoidance
    - Scroll content to keep focused input visible above keyboard
    - _Requirements: 78.2_
  
  - [~] 32.3 Configure keyboard types
    - Use appropriate keyboard types for different inputs (email, phone, numeric)
    - _Requirements: 78.3_
  
  - [~] 32.4 Implement keyboard navigation
    - Provide Done/Next buttons on keyboard
    - Move focus to next input on Next tap
    - Submit form on Done tap
    - _Requirements: 78.4, 78.5, 78.6_
  
  - [~] 32.5 Prevent keyboard overlap
    - Ensure keyboard doesn't cover important UI elements
    - _Requirements: 78.7_



- [ ] 33. Splash screen and app icon
  - [~] 33.1 Create splash screen
    - Design splash screen with BizBridge logo and brand colors
    - Configure splash screen in app.json
    - Support light and dark splash screens
    - Display for minimum 1 second
    - Hide after authentication check completes
    - _Requirements: 75.1, 75.2, 75.3, 75.4, 75.5, 75.6, 75.7_
  
  - [~] 33.2 Create app icon
    - Design professional app icon with BizBridge branding
    - Generate icons for all required sizes (iOS and Android)
    - Use red and black color scheme
    - Create adaptive icons for Android
    - _Requirements: 76.1, 76.2, 76.3, 76.4, 76.5, 76.6_

- [ ] 34. Confirmation dialogs
  - [~] 34.1 Create confirmation dialog component
    - Write reusable confirmation dialog component
    - Support custom title, message, and button labels
    - Apply theme colors
    - _Requirements: 49.5, 49.6, 49.7, 49.8_
  
  - [~] 34.2 Integrate confirmation dialogs
    - Use confirmation dialogs for service deletion, booking cancellation, request decline, logout
    - _Requirements: 49.1, 49.2, 49.3, 49.4_

- [ ] 35. App version and update checking
  - [~] 35.1 Display app version
    - Show app version and build number in profile screen
    - _Requirements: 69.1, 69.2_
  
  - [~] 35.2 Implement update checking
    - Check for updates on app launch
    - Display update notification when new version available
    - Provide link to app store
    - Allow dismissing update notifications
    - Force updates for critical security patches
    - _Requirements: 69.3, 69.4, 69.5, 69.6, 69.7_

- [~] 36. Checkpoint - Core features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 37. Polish and UI refinements
  - [~] 37.1 Add smooth animations
    - Implement smooth screen transitions
    - Add animations for component interactions (button press, card tap)
    - _Requirements: 35.3, 35.4_
  
  - [~] 37.2 Refine spacing and padding
    - Ensure consistent spacing throughout the app
    - _Requirements: 35.2_
  
  - [~] 37.3 Add professional icons
    - Replace any placeholder icons with professional icons from Expo Vector Icons
    - Ensure icons are visually distinct and recognizable
    - _Requirements: 35.1, 45.5, 45.6, 45.7_
  
  - [~] 37.4 Add placeholder images
    - Use high-quality placeholder images for missing content
    - _Requirements: 35.6_
  
  - [~] 37.5 Refine shadows and elevation
    - Ensure proper visual hierarchy with shadows
    - _Requirements: 35.8_

- [ ] 38. Testing and bug fixes
  - [~] 38.1 Test authentication flow
    - Test login, registration, logout
    - Test token persistence and refresh
    - Test authentication error handling
  
  - [~] 38.2 Test customer features
    - Test home screen, search, service details, service requests
    - Test bookings management, request history
    - Test booking completion, cancellation, reviews
  
  - [~] 38.3 Test artisan features
    - Test dashboard, work management, request inbox
    - Test service creation, editing, deletion, status toggle
    - Test request acceptance and decline
  
  - [~] 38.4 Test profile management
    - Test profile viewing and editing
    - Test password change
    - Test theme toggle
  
  - [~] 38.5 Test navigation
    - Test all navigation flows
    - Test deep linking
    - Test back navigation
  
  - [~] 38.6 Test error handling
    - Test network errors
    - Test API errors (401, 403, 404, 500)
    - Test offline mode
    - Test form validation errors
  
  - [~] 38.7 Test on multiple devices
    - Test on iOS devices (iPhone, iPad)
    - Test on Android devices (various screen sizes)
  
  - [~] 38.8 Fix identified bugs
    - Address any bugs found during testing

- [ ] 39. Documentation and cleanup
  - [~] 39.1 Add code comments
    - Add comments to complex logic
    - Document component props and hook return values
  
  - [~] 39.2 Create README
    - Document project setup instructions
    - Document environment variables
    - Document build and deployment process
  
  - [~] 39.3 Clean up unused code
    - Remove any unused imports, components, or files
    - Remove console.log statements
  
  - [~] 39.4 Optimize bundle size
    - Analyze bundle size
    - Remove unnecessary dependencies
    - Implement code splitting where appropriate

- [~] 40. Final checkpoint and deployment preparation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- All tasks build on previous tasks to ensure no orphaned code
- The implementation uses TypeScript with strict mode throughout
- All API endpoints are already implemented in the backend
- The mobile app provides feature parity with the existing web application
- UI should be more modern and professional than the web version
- Red and black color scheme with light and dark theme support
- Focus on mobile-optimized UX with touch-friendly controls

## Future Enhancements (Not in Current Scope)

The following features are documented in requirements but marked as future enhancements:
- Push notifications (Requirement 55)
- Favorite services (Requirement 68)
- Localization support (Requirement 74)
- Biometric authentication (Requirement 79)
- Analytics tracking (Requirement 53) - basic implementation only

These can be implemented in future iterations after the core application is complete and deployed.
