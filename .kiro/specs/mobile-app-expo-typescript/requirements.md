# Requirements Document: BizBridge Mobile Application

## Introduction

BizBridge is a marketplace platform connecting Nigerian artisans with customers seeking handcrafted products and services. This document specifies requirements for a cross-platform mobile application built with TypeScript and Expo that provides feature parity with the existing web application while delivering a superior mobile user experience.

The mobile application will connect to the existing Node.js/Express backend with MongoDB, supporting 26+ craft categories across Lagos LGAs and localities. The application must support both customer and artisan user roles with distinct feature sets for each.

## Glossary

- **Mobile_App**: The TypeScript Expo mobile application for iOS and Android
- **Backend_API**: The existing Node.js/Express REST API with MongoDB
- **Customer**: A user seeking handcrafted products and services
- **Artisan**: A user providing handcrafted products and services
- **Service**: A handcrafted product or service offering listed by an artisan
- **Booking**: A confirmed work agreement between customer and artisan
- **Service_Request**: A customer inquiry sent to an artisan about a service
- **Category**: One of 26+ craft types (Woodworking, Pottery, Jewelry, etc.)
- **Location**: Lagos LGA or locality where services are offered
- **Pricing_Model**: Fixed, negotiate, or categorized pricing structure
- **Theme**: Light or dark color scheme for the application UI
- **Navigation_Stack**: React Navigation routing system
- **Async_Storage**: Local device storage for persisting data
- **Auth_Token**: JWT token for authenticated API requests

## Requirements

### Requirement 1: Project Setup and Structure

**User Story:** As a developer, I want a well-organized TypeScript Expo project, so that I can efficiently develop and maintain the mobile application.

#### Acceptance Criteria

1. THE Mobile_App SHALL be created in the `mobile/` directory using Expo with TypeScript template
2. THE Mobile_App SHALL include a `constants/` directory containing API URLs, categories, locations, and configuration values
3. THE Mobile_App SHALL include a `types/` directory containing TypeScript interfaces for User, Service, Booking, ServiceRequest, and all data models
4. THE Mobile_App SHALL include a `theme/` directory containing light and dark theme configurations
5. THE Mobile_App SHALL include a `components/` directory containing reusable UI components
6. THE Mobile_App SHALL include a `hooks/` directory containing custom hooks for API integration
7. THE Mobile_App SHALL include a `screens/` directory containing all page components
8. THE Mobile_App SHALL include a `navigation/` directory containing React Navigation configuration
9. THE Mobile_App SHALL include a `utils/` directory containing helper functions and validation logic
10. THE Mobile_App SHALL use TypeScript strict mode for type safety

### Requirement 2: Authentication System

**User Story:** As a user, I want to register and login to the mobile app, so that I can access personalized features.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a login screen accepting email and password
2. THE Mobile_App SHALL provide separate registration screens for customers and artisans
3. WHEN a user submits valid credentials, THE Mobile_App SHALL send a POST request to `/api/auth/login`
4. WHEN a customer registers, THE Mobile_App SHALL send a POST request to `/api/auth/register/customer` with fullName, email, password, and location
5. WHEN an artisan registers, THE Mobile_App SHALL send a POST request to `/api/auth/register/artisan` with contactName, businessName, email, password, phoneNumber, and location
6. WHEN authentication succeeds, THE Mobile_App SHALL store the JWT token in Async_Storage
7. WHEN authentication succeeds, THE Mobile_App SHALL navigate to the appropriate dashboard
8. THE Mobile_App SHALL include the Auth_Token in all authenticated API requests
9. WHEN the Auth_Token is invalid or expired, THE Mobile_App SHALL redirect to the login screen
10. THE Mobile_App SHALL provide a logout function that clears Async_Storage and returns to login

### Requirement 3: Theme System

**User Story:** As a user, I want to switch between light and dark modes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide light and dark theme configurations
2. THE Mobile_App SHALL use a red and black color scheme consistent with the web application
3. THE Mobile_App SHALL store the user's theme preference in Async_Storage
4. WHEN the app launches, THE Mobile_App SHALL load the saved theme preference
5. THE Mobile_App SHALL provide a theme toggle control in the settings or profile screen
6. WHEN the user toggles the theme, THE Mobile_App SHALL update all UI components immediately
7. THE Mobile_App SHALL apply the theme to all screens, components, and navigation elements
8. THE Mobile_App SHALL ensure text remains readable in both themes

### Requirement 4: Home Screen

**User Story:** As a user, I want to see featured services and search options on the home screen, so that I can quickly find artisans.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a home screen as the initial authenticated view
2. THE Mobile_App SHALL fetch featured services from `/api/services/featured` on home screen load
3. THE Mobile_App SHALL display featured services in a horizontal scrollable list with images
4. THE Mobile_App SHALL display a search bar at the top of the home screen
5. THE Mobile_App SHALL display all 26 categories in a grid or list format
6. WHEN a user taps a category, THE Mobile_App SHALL navigate to the service search screen with that category pre-selected
7. WHEN a user taps a featured service, THE Mobile_App SHALL navigate to the service details screen
8. THE Mobile_App SHALL display a loading indicator while fetching featured services
9. WHEN featured services fail to load, THE Mobile_App SHALL display an error message with retry option
10. THE Mobile_App SHALL display an empty state message when no featured services exist

### Requirement 5: Service Search and Browse

**User Story:** As a customer, I want to search and filter services, so that I can find artisans matching my needs.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a service search screen with search input and filters
2. THE Mobile_App SHALL send GET requests to `/api/services/search` with query parameters
3. THE Mobile_App SHALL support filtering by category, location (LGA), and pricing type
4. THE Mobile_App SHALL support text search by service title, description, and tags
5. THE Mobile_App SHALL display search results in a scrollable list with service cards
6. WHEN a user applies filters, THE Mobile_App SHALL update the search results immediately
7. WHEN a user taps a service card, THE Mobile_App SHALL navigate to the service details screen
8. THE Mobile_App SHALL display service image, title, category, location, and price on each card
9. THE Mobile_App SHALL display a loading indicator while fetching search results
10. WHEN no results match the search criteria, THE Mobile_App SHALL display an empty state message

### Requirement 6: Service Details Screen

**User Story:** As a customer, I want to view detailed service information, so that I can decide whether to request the service.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a service details screen showing all service information
2. THE Mobile_App SHALL fetch service details from `/api/services/:id` when the screen loads
3. THE Mobile_App SHALL display service images in a swipeable gallery
4. THE Mobile_App SHALL display service title, description, category, and tags
5. THE Mobile_App SHALL display pricing information based on the pricing model (fixed, negotiate, or categorized)
6. WHEN the service has categorized pricing, THE Mobile_App SHALL display all categories with prices
7. THE Mobile_App SHALL display artisan information including name, rating, and profile image
8. THE Mobile_App SHALL display service locations (LGAs and localities)
9. THE Mobile_App SHALL provide a "Request Service" button for customers
10. WHEN a customer taps "Request Service", THE Mobile_App SHALL navigate to the service request form
11. WHEN an artisan views their own service, THE Mobile_App SHALL provide "Edit Service" and "Delete Service" options
12. THE Mobile_App SHALL display a loading indicator while fetching service details
13. WHEN service details fail to load, THE Mobile_App SHALL display an error message

### Requirement 7: Service Request Creation

**User Story:** As a customer, I want to send service requests to artisans, so that I can inquire about their services.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a service request form screen
2. THE Mobile_App SHALL require title and description fields in the form
3. THE Mobile_App SHALL provide optional fields for preferred schedule and special requirements
4. WHEN the service has categorized pricing, THE Mobile_App SHALL display a category selector
5. WHEN a customer submits the form, THE Mobile_App SHALL send a POST request to `/api/service-requests`
6. THE Mobile_App SHALL validate that title is not empty and does not exceed 100 characters
7. THE Mobile_App SHALL validate that description is not empty and does not exceed 1000 characters
8. WHEN the request is created successfully, THE Mobile_App SHALL display a success message
9. WHEN the request is created successfully, THE Mobile_App SHALL navigate to the customer request history screen
10. WHEN the request fails, THE Mobile_App SHALL display an error message
11. THE Mobile_App SHALL display a loading indicator while submitting the request

### Requirement 8: Customer Dashboard

**User Story:** As a customer, I want to see my bookings and requests overview, so that I can track my activities.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a customer dashboard screen
2. THE Mobile_App SHALL fetch customer statistics from `/api/bookings/analytics`
3. THE Mobile_App SHALL display the count of active bookings
4. THE Mobile_App SHALL display the count of pending service requests
5. THE Mobile_App SHALL display the count of completed bookings
6. THE Mobile_App SHALL provide navigation buttons to "My Bookings" and "My Requests" screens
7. THE Mobile_App SHALL display recent bookings in a list
8. THE Mobile_App SHALL display a loading indicator while fetching dashboard data
9. WHEN dashboard data fails to load, THE Mobile_App SHALL display an error message with retry option

### Requirement 9: Customer Bookings Management

**User Story:** As a customer, I want to view and manage my bookings, so that I can track service progress.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "My Bookings" screen for customers
2. THE Mobile_App SHALL fetch bookings from `/api/bookings/my-bookings`
3. THE Mobile_App SHALL display bookings grouped by status (in_progress, completed, cancelled)
4. THE Mobile_App SHALL display booking title, artisan name, service, scheduled date, and status
5. WHEN a customer taps a booking, THE Mobile_App SHALL navigate to the booking details screen
6. THE Mobile_App SHALL provide filter options for booking status
7. THE Mobile_App SHALL display a loading indicator while fetching bookings
8. WHEN no bookings exist, THE Mobile_App SHALL display an empty state message
9. THE Mobile_App SHALL support pull-to-refresh to reload bookings

### Requirement 10: Customer Request History

**User Story:** As a customer, I want to view my service request history, so that I can track responses from artisans.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a customer request history screen
2. THE Mobile_App SHALL fetch service requests from `/api/service-requests/my-requests`
3. THE Mobile_App SHALL display requests grouped by status (pending, viewed, accepted, declined, converted)
4. THE Mobile_App SHALL display request title, artisan name, service, status, and creation date
5. WHEN a customer taps a request, THE Mobile_App SHALL navigate to the request details screen
6. THE Mobile_App SHALL provide filter options for request status
7. THE Mobile_App SHALL display a loading indicator while fetching requests
8. WHEN no requests exist, THE Mobile_App SHALL display an empty state message
9. THE Mobile_App SHALL support pull-to-refresh to reload requests

### Requirement 11: Artisan Dashboard

**User Story:** As an artisan, I want to see my business overview, so that I can track my performance.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an artisan dashboard screen
2. THE Mobile_App SHALL fetch artisan statistics from `/api/bookings/analytics`
3. THE Mobile_App SHALL display the count of active bookings
4. THE Mobile_App SHALL display the count of pending service requests
5. THE Mobile_App SHALL display the count of total services listed
6. THE Mobile_App SHALL display average rating and total reviews
7. THE Mobile_App SHALL provide navigation buttons to "My Work", "Service Requests", and "My Services" screens
8. THE Mobile_App SHALL display recent bookings in a list
9. THE Mobile_App SHALL display a loading indicator while fetching dashboard data
10. WHEN dashboard data fails to load, THE Mobile_App SHALL display an error message with retry option

### Requirement 12: Artisan Work Management

**User Story:** As an artisan, I want to view and manage my bookings, so that I can track my work commitments.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "My Work" screen for artisans
2. THE Mobile_App SHALL fetch bookings from `/api/bookings/my-work`
3. THE Mobile_App SHALL display bookings grouped by status (in_progress, completed, cancelled)
4. THE Mobile_App SHALL display booking title, customer name, service, scheduled date, and status
5. WHEN an artisan taps a booking, THE Mobile_App SHALL navigate to the booking details screen
6. THE Mobile_App SHALL provide filter options for booking status
7. THE Mobile_App SHALL display a loading indicator while fetching bookings
8. WHEN no bookings exist, THE Mobile_App SHALL display an empty state message
9. THE Mobile_App SHALL support pull-to-refresh to reload bookings

### Requirement 13: Service Request Inbox

**User Story:** As an artisan, I want to view incoming service requests, so that I can respond to customer inquiries.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a service request inbox screen for artisans
2. THE Mobile_App SHALL fetch service requests from `/api/service-requests/inbox`
3. THE Mobile_App SHALL display requests grouped by status (pending, viewed, accepted, declined)
4. THE Mobile_App SHALL display request title, customer name, service, status, and creation date
5. WHEN an artisan taps a request, THE Mobile_App SHALL navigate to the request details screen
6. THE Mobile_App SHALL highlight unread requests with a visual indicator
7. THE Mobile_App SHALL provide filter options for request status
8. THE Mobile_App SHALL display a loading indicator while fetching requests
9. WHEN no requests exist, THE Mobile_App SHALL display an empty state message
10. THE Mobile_App SHALL support pull-to-refresh to reload requests

### Requirement 14: Service Request Response

**User Story:** As an artisan, I want to accept or decline service requests, so that I can manage my workload.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a service request details screen for artisans
2. THE Mobile_App SHALL display all request information including title, description, preferred schedule, and special requirements
3. THE Mobile_App SHALL provide "Accept" and "Decline" buttons for pending and viewed requests
4. WHEN an artisan taps "Accept", THE Mobile_App SHALL display a response form with optional message and proposed terms
5. WHEN an artisan submits acceptance, THE Mobile_App SHALL send a PUT request to `/api/service-requests/:id/accept`
6. WHEN an artisan taps "Decline", THE Mobile_App SHALL display a form requesting a decline reason
7. WHEN an artisan submits decline, THE Mobile_App SHALL send a PUT request to `/api/service-requests/:id/decline`
8. WHEN the response is submitted successfully, THE Mobile_App SHALL update the request status
9. WHEN the response fails, THE Mobile_App SHALL display an error message
10. THE Mobile_App SHALL display a loading indicator while submitting the response

### Requirement 15: Service Management

**User Story:** As an artisan, I want to view and manage my services, so that I can maintain my service listings.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "My Services" screen for artisans
2. THE Mobile_App SHALL fetch services from `/api/services/my-services`
3. THE Mobile_App SHALL display services in a scrollable list with images
4. THE Mobile_App SHALL display service title, category, pricing type, and active status
5. WHEN an artisan taps a service, THE Mobile_App SHALL navigate to the service details screen
6. THE Mobile_App SHALL provide an "Add Service" button
7. WHEN an artisan taps "Add Service", THE Mobile_App SHALL navigate to the add service form
8. THE Mobile_App SHALL provide "Edit" and "Delete" options for each service
9. THE Mobile_App SHALL display a loading indicator while fetching services
10. WHEN no services exist, THE Mobile_App SHALL display an empty state message with "Add Service" prompt

### Requirement 16: Service Creation

**User Story:** As an artisan, I want to create new service listings, so that I can offer my services to customers.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an add service form screen
2. THE Mobile_App SHALL require title, description, category, and pricing type fields
3. THE Mobile_App SHALL provide a category picker with all 26 categories
4. THE Mobile_App SHALL provide a pricing type selector (fixed, negotiate, categorized)
5. WHEN pricing type is "fixed", THE Mobile_App SHALL require basePrice and baseDuration fields
6. WHEN pricing type is "categorized", THE Mobile_App SHALL provide a form to add multiple categories with prices
7. THE Mobile_App SHALL provide location selection for LGAs and localities
8. THE Mobile_App SHALL provide image upload functionality for service images
9. WHEN an artisan submits the form, THE Mobile_App SHALL send a POST request to `/api/services`
10. THE Mobile_App SHALL validate all required fields before submission
11. WHEN the service is created successfully, THE Mobile_App SHALL navigate to the service details screen
12. WHEN creation fails, THE Mobile_App SHALL display an error message
13. THE Mobile_App SHALL display a loading indicator while submitting the service

### Requirement 17: Service Editing

**User Story:** As an artisan, I want to edit my service listings, so that I can keep information up to date.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an edit service form screen
2. THE Mobile_App SHALL pre-populate the form with existing service data
3. THE Mobile_App SHALL allow editing of all service fields except artisan ID
4. WHEN an artisan submits changes, THE Mobile_App SHALL send a PUT request to `/api/services/:id`
5. THE Mobile_App SHALL validate all required fields before submission
6. WHEN the service is updated successfully, THE Mobile_App SHALL navigate back to the service details screen
7. WHEN update fails, THE Mobile_App SHALL display an error message
8. THE Mobile_App SHALL display a loading indicator while submitting changes

### Requirement 18: Booking Details

**User Story:** As a user, I want to view detailed booking information, so that I can track service agreements.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a booking details screen for both customers and artisans
2. THE Mobile_App SHALL fetch booking details from `/api/bookings/:id`
3. THE Mobile_App SHALL display booking title, description, status, and scheduled dates
4. THE Mobile_App SHALL display service information including title and category
5. THE Mobile_App SHALL display customer and artisan information based on user role
6. THE Mobile_App SHALL display agreement terms including pricing, duration, and location
7. THE Mobile_App SHALL display contract acceptance status for both parties
8. WHEN the booking status is "in_progress", THE Mobile_App SHALL provide action buttons based on user role
9. WHEN a customer views an in_progress booking, THE Mobile_App SHALL provide a "Mark as Completed" button
10. THE Mobile_App SHALL display booking messages in a chat-like interface
11. THE Mobile_App SHALL provide a message input field to send new messages
12. THE Mobile_App SHALL display a loading indicator while fetching booking details
13. WHEN booking details fail to load, THE Mobile_App SHALL display an error message

### Requirement 19: Booking Completion

**User Story:** As a customer, I want to mark bookings as completed, so that I can confirm service delivery.

#### Acceptance Criteria

1. WHEN a customer taps "Mark as Completed", THE Mobile_App SHALL display a confirmation dialog
2. WHEN the customer confirms, THE Mobile_App SHALL send a PUT request to `/api/bookings/:id/complete`
3. WHEN completion succeeds, THE Mobile_App SHALL update the booking status to "completed"
4. WHEN completion succeeds, THE Mobile_App SHALL prompt the customer to leave a review
5. WHEN completion fails, THE Mobile_App SHALL display an error message
6. THE Mobile_App SHALL display a loading indicator while processing completion

### Requirement 20: Booking Cancellation

**User Story:** As a user, I want to cancel bookings, so that I can manage changes in plans.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Cancel Booking" option in the booking details screen
2. WHEN a user taps "Cancel Booking", THE Mobile_App SHALL display a cancellation form
3. THE Mobile_App SHALL require a cancellation reason from predefined options
4. THE Mobile_App SHALL provide an optional description field for additional details
5. WHEN a user submits cancellation, THE Mobile_App SHALL send a PUT request to `/api/bookings/:id/cancel`
6. WHEN cancellation succeeds, THE Mobile_App SHALL update the booking status to "cancelled"
7. WHEN cancellation fails, THE Mobile_App SHALL display an error message
8. THE Mobile_App SHALL display a loading indicator while processing cancellation

### Requirement 21: Review System

**User Story:** As a user, I want to leave reviews for completed bookings, so that I can share my experience.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a review form for completed bookings
2. THE Mobile_App SHALL require a rating from 1 to 5 stars
3. THE Mobile_App SHALL provide an optional comment field with maximum 500 characters
4. WHEN a customer submits a review, THE Mobile_App SHALL send a POST request to `/api/bookings/:id/review`
5. WHEN an artisan submits a review, THE Mobile_App SHALL send a POST request to `/api/bookings/:id/review`
6. THE Mobile_App SHALL validate that rating is between 1 and 5
7. WHEN the review is submitted successfully, THE Mobile_App SHALL display a success message
8. WHEN review submission fails, THE Mobile_App SHALL display an error message
9. THE Mobile_App SHALL display a loading indicator while submitting the review
10. THE Mobile_App SHALL prevent duplicate reviews from the same user for the same booking

### Requirement 22: User Profile Display

**User Story:** As a user, I want to view my profile information, so that I can see my account details.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a profile screen for all users
2. THE Mobile_App SHALL fetch user profile from `/api/auth/me`
3. THE Mobile_App SHALL display profile image, username, and email
4. WHEN the user is a customer, THE Mobile_App SHALL display fullName and location
5. WHEN the user is an artisan, THE Mobile_App SHALL display businessName, contactName, phoneNumber, and business location
6. WHEN the user is an artisan, THE Mobile_App SHALL display specialties, ratings, and analytics
7. THE Mobile_App SHALL provide an "Edit Profile" button
8. THE Mobile_App SHALL provide a "Logout" button
9. THE Mobile_App SHALL provide a theme toggle control
10. THE Mobile_App SHALL display a loading indicator while fetching profile data
11. WHEN profile data fails to load, THE Mobile_App SHALL display an error message

### Requirement 23: Profile Editing

**User Story:** As a user, I want to edit my profile information, so that I can keep my details current.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a profile edit screen
2. THE Mobile_App SHALL pre-populate the form with current profile data
3. WHEN the user is a customer, THE Mobile_App SHALL allow editing fullName, email, and location
4. WHEN the user is an artisan, THE Mobile_App SHALL allow editing businessName, contactName, phoneNumber, businessDescription, and location
5. THE Mobile_App SHALL provide profile image upload functionality
6. WHEN a user submits changes, THE Mobile_App SHALL send a PUT request to `/api/users/profile`
7. THE Mobile_App SHALL validate email format before submission
8. THE Mobile_App SHALL validate phone number format for artisans
9. WHEN the profile is updated successfully, THE Mobile_App SHALL display a success message
10. WHEN update fails, THE Mobile_App SHALL display an error message
11. THE Mobile_App SHALL display a loading indicator while submitting changes

### Requirement 24: Navigation System

**User Story:** As a user, I want intuitive navigation, so that I can easily access different features.

#### Acceptance Criteria

1. THE Mobile_App SHALL use React Navigation for routing
2. THE Mobile_App SHALL provide a bottom tab navigator for main screens
3. WHEN the user is a customer, THE Mobile_App SHALL display tabs for Home, Search, Bookings, Requests, and Profile
4. WHEN the user is an artisan, THE Mobile_App SHALL display tabs for Home, My Work, Requests, Services, and Profile
5. THE Mobile_App SHALL use stack navigation for screen hierarchies
6. THE Mobile_App SHALL provide back navigation for all nested screens
7. THE Mobile_App SHALL display appropriate screen titles in the navigation header
8. THE Mobile_App SHALL apply theme colors to navigation elements
9. THE Mobile_App SHALL prevent navigation to authenticated screens when not logged in

### Requirement 25: Image Upload

**User Story:** As a user, I want to upload images, so that I can add visuals to my profile and services.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide image selection from device gallery
2. THE Mobile_App SHALL provide image capture using device camera
3. THE Mobile_App SHALL display image preview before upload
4. THE Mobile_App SHALL compress images before upload to reduce file size
5. WHEN uploading service images, THE Mobile_App SHALL support multiple image selection
6. WHEN uploading profile images, THE Mobile_App SHALL support single image selection
7. THE Mobile_App SHALL send images to `/api/upload` endpoint
8. THE Mobile_App SHALL display upload progress indicator
9. WHEN upload succeeds, THE Mobile_App SHALL use the returned image URL
10. WHEN upload fails, THE Mobile_App SHALL display an error message

### Requirement 26: Error Handling

**User Story:** As a user, I want clear error messages, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN a network request fails, THE Mobile_App SHALL display a user-friendly error message
2. WHEN the Backend_API returns a 401 error, THE Mobile_App SHALL redirect to the login screen
3. WHEN the Backend_API returns a 403 error, THE Mobile_App SHALL display an "Access Denied" message
4. WHEN the Backend_API returns a 404 error, THE Mobile_App SHALL display a "Not Found" message
5. WHEN the Backend_API returns a 500 error, THE Mobile_App SHALL display a "Server Error" message with retry option
6. WHEN the device has no internet connection, THE Mobile_App SHALL display an "Offline" message
7. WHEN form validation fails, THE Mobile_App SHALL display field-specific error messages
8. THE Mobile_App SHALL log errors to console for debugging purposes
9. THE Mobile_App SHALL provide retry buttons for failed network requests

### Requirement 27: Loading States

**User Story:** As a user, I want to see loading indicators, so that I know the app is processing my request.

#### Acceptance Criteria

1. WHEN fetching data from the Backend_API, THE Mobile_App SHALL display a loading indicator
2. WHEN submitting forms, THE Mobile_App SHALL display a loading indicator and disable the submit button
3. WHEN uploading images, THE Mobile_App SHALL display an upload progress indicator
4. THE Mobile_App SHALL use consistent loading indicator styling across all screens
5. THE Mobile_App SHALL display skeleton screens for list views while loading
6. THE Mobile_App SHALL hide loading indicators when data loads successfully
7. THE Mobile_App SHALL hide loading indicators when requests fail

### Requirement 28: Empty States

**User Story:** As a user, I want helpful empty state messages, so that I understand when no data is available.

#### Acceptance Criteria

1. WHEN a list screen has no items, THE Mobile_App SHALL display an empty state message
2. THE Mobile_App SHALL display contextual empty state messages based on the screen
3. WHEN "My Bookings" is empty, THE Mobile_App SHALL display "No bookings yet" with a call-to-action
4. WHEN "My Services" is empty, THE Mobile_App SHALL display "No services listed" with "Add Service" button
5. WHEN search returns no results, THE Mobile_App SHALL display "No services found" with filter adjustment suggestions
6. THE Mobile_App SHALL use icons or illustrations in empty states
7. THE Mobile_App SHALL apply theme colors to empty state components

### Requirement 29: Data Persistence

**User Story:** As a user, I want my authentication to persist, so that I don't have to login every time.

#### Acceptance Criteria

1. THE Mobile_App SHALL store the Auth_Token in Async_Storage after successful login
2. THE Mobile_App SHALL store the user role in Async_Storage after successful login
3. THE Mobile_App SHALL store the theme preference in Async_Storage
4. WHEN the app launches, THE Mobile_App SHALL check Async_Storage for an Auth_Token
5. WHEN a valid Auth_Token exists, THE Mobile_App SHALL navigate to the appropriate dashboard
6. WHEN no Auth_Token exists, THE Mobile_App SHALL navigate to the login screen
7. WHEN the user logs out, THE Mobile_App SHALL clear all data from Async_Storage
8. THE Mobile_App SHALL handle Async_Storage errors gracefully

### Requirement 30: Constants and Configuration

**User Story:** As a developer, I want centralized constants, so that I can easily maintain configuration values.

#### Acceptance Criteria

1. THE Mobile_App SHALL define API_BASE_URL in a constants file
2. THE Mobile_App SHALL define all 26 JOB_CATEGORIES with IDs, names, and descriptions
3. THE Mobile_App SHALL define all 20 LAGOS_LGAS with IDs, names, and regions
4. THE Mobile_App SHALL define LAGOS_LOCALITIES mapped to their LGAs
5. THE Mobile_App SHALL define PRICING_TYPES as an array of valid pricing models
6. THE Mobile_App SHALL define BOOKING_STATUSES as an array of valid booking statuses
7. THE Mobile_App SHALL define SERVICE_REQUEST_STATUSES as an array of valid request statuses
8. THE Mobile_App SHALL define CANCELLATION_REASONS as an array of predefined reasons
9. THE Mobile_App SHALL define DISPUTE_REASONS as an array of predefined reasons
10. THE Mobile_App SHALL export all constants for use throughout the application

### Requirement 31: TypeScript Type Definitions

**User Story:** As a developer, I want comprehensive TypeScript types, so that I can catch errors at compile time.

#### Acceptance Criteria

1. THE Mobile_App SHALL define a User interface matching the Backend_API User model
2. THE Mobile_App SHALL define a Service interface matching the Backend_API Service model
3. THE Mobile_App SHALL define a Booking interface matching the Backend_API Booking model
4. THE Mobile_App SHALL define a ServiceRequest interface matching the Backend_API ServiceRequest model
5. THE Mobile_App SHALL define a Location interface for LGA and locality data
6. THE Mobile_App SHALL define a Category interface for job categories
7. THE Mobile_App SHALL define a PricingModel interface for service pricing structures
8. THE Mobile_App SHALL define an AuthResponse interface for authentication responses
9. THE Mobile_App SHALL define a Theme interface for theme configuration
10. THE Mobile_App SHALL define navigation param types for all screens
11. THE Mobile_App SHALL export all type definitions for use throughout the application

### Requirement 32: Custom API Hooks

**User Story:** As a developer, I want reusable API hooks, so that I can efficiently integrate with the backend.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a useAuth hook for authentication operations
2. THE Mobile_App SHALL provide a useServices hook for fetching and managing services
3. THE Mobile_App SHALL provide a useBookings hook for fetching and managing bookings
4. THE Mobile_App SHALL provide a useServiceRequests hook for fetching and managing service requests
5. THE Mobile_App SHALL provide a useProfile hook for fetching and updating user profiles
6. THE Mobile_App SHALL provide a useSearch hook for searching services
7. WHEN a hook makes an API request, THE hook SHALL include the Auth_Token in headers
8. WHEN a hook receives a 401 response, THE hook SHALL trigger logout
9. THE Mobile_App SHALL handle loading and error states within hooks
10. THE Mobile_App SHALL return data, loading, and error states from all hooks

### Requirement 33: Reusable UI Components

**User Story:** As a developer, I want reusable UI components, so that I can maintain consistent design.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a Button component with primary, secondary, and outline variants
2. THE Mobile_App SHALL provide a Card component for displaying content containers
3. THE Mobile_App SHALL provide an Input component for text input fields
4. THE Mobile_App SHALL provide a Picker component for dropdown selections
5. THE Mobile_App SHALL provide a ServiceCard component for displaying service listings
6. THE Mobile_App SHALL provide a BookingCard component for displaying booking items
7. THE Mobile_App SHALL provide a RequestCard component for displaying service request items
8. THE Mobile_App SHALL provide a LoadingSpinner component for loading states
9. THE Mobile_App SHALL provide an ErrorMessage component for error displays
10. THE Mobile_App SHALL provide an EmptyState component for empty list states
11. THE Mobile_App SHALL apply theme colors to all components
12. THE Mobile_App SHALL ensure all components are accessible

### Requirement 34: Form Validation

**User Story:** As a user, I want form validation, so that I submit correct information.

#### Acceptance Criteria

1. THE Mobile_App SHALL validate email format using regex pattern
2. THE Mobile_App SHALL validate password length (minimum 6 characters)
3. THE Mobile_App SHALL validate phone number format for Nigerian numbers
4. THE Mobile_App SHALL validate required fields before form submission
5. THE Mobile_App SHALL validate maximum character limits for text fields
6. THE Mobile_App SHALL validate numeric fields for pricing inputs
7. THE Mobile_App SHALL validate date fields for scheduling
8. THE Mobile_App SHALL display inline validation errors below input fields
9. THE Mobile_App SHALL prevent form submission when validation fails
10. THE Mobile_App SHALL clear validation errors when user corrects input

### Requirement 35: Professional UI Design

**User Story:** As a user, I want a modern and professional interface, so that I have a pleasant experience.

#### Acceptance Criteria

1. THE Mobile_App SHALL use professional icons from Expo Vector Icons or similar library
2. THE Mobile_App SHALL use consistent spacing and padding throughout the application
3. THE Mobile_App SHALL use smooth animations for screen transitions
4. THE Mobile_App SHALL use smooth animations for component interactions
5. THE Mobile_App SHALL use a consistent typography scale for text elements
6. THE Mobile_App SHALL use high-quality placeholder images for missing content
7. THE Mobile_App SHALL use rounded corners for cards and buttons
8. THE Mobile_App SHALL use shadows and elevation for visual hierarchy
9. THE Mobile_App SHALL ensure touch targets are at least 44x44 pixels
10. THE Mobile_App SHALL use the red and black color scheme from the web application
11. THE Mobile_App SHALL ensure sufficient color contrast for accessibility

### Requirement 36: Responsive Design

**User Story:** As a user, I want the app to work on different screen sizes, so that I can use it on any device.

#### Acceptance Criteria

1. THE Mobile_App SHALL adapt layouts for small phone screens (320px width)
2. THE Mobile_App SHALL adapt layouts for standard phone screens (375px width)
3. THE Mobile_App SHALL adapt layouts for large phone screens (414px width)
4. THE Mobile_App SHALL adapt layouts for tablet screens (768px width and above)
5. THE Mobile_App SHALL use flexible layouts that scale with screen size
6. THE Mobile_App SHALL use responsive font sizes based on screen dimensions
7. THE Mobile_App SHALL ensure images scale proportionally
8. THE Mobile_App SHALL ensure touch targets remain accessible on all screen sizes
9. THE Mobile_App SHALL test layouts on both iOS and Android devices

### Requirement 37: Offline Handling

**User Story:** As a user, I want to know when I'm offline, so that I understand why features aren't working.

#### Acceptance Criteria

1. THE Mobile_App SHALL detect when the device loses internet connectivity
2. WHEN the device is offline, THE Mobile_App SHALL display an offline banner
3. WHEN the device is offline, THE Mobile_App SHALL disable network-dependent features
4. WHEN the device is offline, THE Mobile_App SHALL display cached data when available
5. WHEN the device reconnects, THE Mobile_App SHALL hide the offline banner
6. WHEN the device reconnects, THE Mobile_App SHALL retry failed requests
7. THE Mobile_App SHALL provide a manual refresh option when offline

### Requirement 38: Search Functionality

**User Story:** As a customer, I want to search for services by text, so that I can find specific offerings.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a search input on the home screen
2. THE Mobile_App SHALL provide a search input on the service search screen
3. WHEN a user types in the search input, THE Mobile_App SHALL debounce the input by 500ms
4. WHEN the debounce completes, THE Mobile_App SHALL send a GET request to `/api/services/search` with the query parameter
5. THE Mobile_App SHALL search service titles, descriptions, and tags
6. THE Mobile_App SHALL display search results in real-time as the user types
7. THE Mobile_App SHALL display a loading indicator while searching
8. WHEN search returns no results, THE Mobile_App SHALL display an empty state message
9. THE Mobile_App SHALL allow clearing the search input with a clear button
10. WHEN the search input is cleared, THE Mobile_App SHALL display all services or featured services

### Requirement 39: Filter Functionality

**User Story:** As a customer, I want to filter services, so that I can narrow down my search.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide filter options on the service search screen
2. THE Mobile_App SHALL provide a category filter with all 26 categories
3. THE Mobile_App SHALL provide a location filter with all Lagos LGAs
4. THE Mobile_App SHALL provide a pricing type filter (fixed, negotiate, categorized)
5. WHEN a user applies filters, THE Mobile_App SHALL send a GET request to `/api/services/search` with filter parameters
6. THE Mobile_App SHALL allow multiple filters to be applied simultaneously
7. THE Mobile_App SHALL display active filter indicators
8. THE Mobile_App SHALL provide a "Clear Filters" button
9. WHEN filters are cleared, THE Mobile_App SHALL reset to showing all services
10. THE Mobile_App SHALL persist filter selections while navigating within the search flow

### Requirement 40: Messaging in Bookings

**User Story:** As a user, I want to message the other party in a booking, so that I can communicate about the service.

#### Acceptance Criteria

1. THE Mobile_App SHALL display booking messages in chronological order
2. THE Mobile_App SHALL display sender name and timestamp for each message
3. THE Mobile_App SHALL distinguish between customer and artisan messages visually
4. THE Mobile_App SHALL provide a message input field at the bottom of the booking details screen
5. WHEN a user types a message and taps send, THE Mobile_App SHALL send a POST request to `/api/bookings/:id/messages`
6. THE Mobile_App SHALL validate that message is not empty and does not exceed 1000 characters
7. WHEN the message is sent successfully, THE Mobile_App SHALL append it to the message list
8. WHEN message sending fails, THE Mobile_App SHALL display an error message
9. THE Mobile_App SHALL display a loading indicator while sending messages
10. THE Mobile_App SHALL auto-scroll to the latest message when new messages arrive

### Requirement 41: Pull-to-Refresh

**User Story:** As a user, I want to pull down to refresh lists, so that I can get the latest data.

#### Acceptance Criteria

1. THE Mobile_App SHALL support pull-to-refresh on all list screens
2. WHEN a user pulls down on a list, THE Mobile_App SHALL display a refresh indicator
3. WHEN a user pulls down on a list, THE Mobile_App SHALL refetch data from the Backend_API
4. WHEN data refresh completes, THE Mobile_App SHALL hide the refresh indicator
5. WHEN data refresh fails, THE Mobile_App SHALL hide the refresh indicator and display an error message
6. THE Mobile_App SHALL use consistent refresh indicator styling across all screens

### Requirement 42: Date and Time Selection

**User Story:** As a user, I want to select dates and times, so that I can schedule services.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a date picker for selecting dates
2. THE Mobile_App SHALL provide a time picker for selecting times
3. THE Mobile_App SHALL validate that selected dates are not in the past
4. THE Mobile_App SHALL format dates in a user-friendly format (e.g., "Jan 15, 2024")
5. THE Mobile_App SHALL format times in 12-hour format with AM/PM
6. THE Mobile_App SHALL use native date/time pickers for iOS and Android
7. THE Mobile_App SHALL apply theme colors to date/time pickers

### Requirement 43: Image Gallery

**User Story:** As a user, I want to view service images in a gallery, so that I can see details clearly.

#### Acceptance Criteria

1. THE Mobile_App SHALL display service images in a swipeable gallery
2. THE Mobile_App SHALL display image indicators showing current position
3. WHEN a user taps an image, THE Mobile_App SHALL open a full-screen image viewer
4. THE Mobile_App SHALL support pinch-to-zoom in the full-screen viewer
5. THE Mobile_App SHALL provide navigation arrows or swipe gestures to move between images
6. THE Mobile_App SHALL display a close button in the full-screen viewer
7. THE Mobile_App SHALL display a loading indicator while images load
8. WHEN images fail to load, THE Mobile_App SHALL display a placeholder image

### Requirement 44: Rating Display

**User Story:** As a user, I want to see ratings, so that I can assess service quality.

#### Acceptance Criteria

1. THE Mobile_App SHALL display artisan ratings as star icons
2. THE Mobile_App SHALL display average rating as a numeric value (e.g., "4.5")
3. THE Mobile_App SHALL display total review count (e.g., "(23 reviews)")
4. THE Mobile_App SHALL use filled stars for whole numbers and half-filled stars for decimals
5. THE Mobile_App SHALL display ratings on service cards, service details, and artisan profiles
6. THE Mobile_App SHALL apply theme colors to rating components
7. WHEN an artisan has no ratings, THE Mobile_App SHALL display "No ratings yet"

### Requirement 45: Category Icons

**User Story:** As a user, I want to see category icons, so that I can quickly identify service types.

#### Acceptance Criteria

1. THE Mobile_App SHALL assign a unique icon to each of the 26 categories
2. THE Mobile_App SHALL display category icons on the home screen category grid
3. THE Mobile_App SHALL display category icons on service cards
4. THE Mobile_App SHALL display category icons in category pickers
5. THE Mobile_App SHALL use professional icons from Expo Vector Icons or similar library
6. THE Mobile_App SHALL apply theme colors to category icons
7. THE Mobile_App SHALL ensure icons are visually distinct and recognizable

### Requirement 46: Location Display

**User Story:** As a user, I want to see service locations, so that I know where services are available.

#### Acceptance Criteria

1. THE Mobile_App SHALL display service locations on service cards
2. THE Mobile_App SHALL display service locations on service details screens
3. WHEN a service has multiple locations, THE Mobile_App SHALL display all locations
4. THE Mobile_App SHALL format locations as "LGA, Lagos" or "Locality, LGA"
5. THE Mobile_App SHALL use location icons to indicate geographic information
6. THE Mobile_App SHALL apply theme colors to location displays

### Requirement 47: Price Display

**User Story:** As a user, I want to see service prices, so that I can make informed decisions.

#### Acceptance Criteria

1. THE Mobile_App SHALL display prices on service cards
2. THE Mobile_App SHALL display prices on service details screens
3. WHEN pricing type is "fixed", THE Mobile_App SHALL display the base price (e.g., "₦50,000")
4. WHEN pricing type is "negotiate", THE Mobile_App SHALL display "Price on consultation"
5. WHEN pricing type is "categorized", THE Mobile_App SHALL display price range (e.g., "₦20,000 - ₦100,000")
6. THE Mobile_App SHALL format prices with thousand separators
7. THE Mobile_App SHALL use the Nigerian Naira symbol (₦)
8. THE Mobile_App SHALL apply theme colors to price displays

### Requirement 48: Status Badges

**User Story:** As a user, I want to see status indicators, so that I can quickly understand item states.

#### Acceptance Criteria

1. THE Mobile_App SHALL display status badges on booking cards
2. THE Mobile_App SHALL display status badges on service request cards
3. THE Mobile_App SHALL use distinct colors for different statuses
4. WHEN booking status is "in_progress", THE Mobile_App SHALL display a blue badge
5. WHEN booking status is "completed", THE Mobile_App SHALL display a green badge
6. WHEN booking status is "cancelled", THE Mobile_App SHALL display a red badge
7. WHEN request status is "pending", THE Mobile_App SHALL display a yellow badge
8. WHEN request status is "accepted", THE Mobile_App SHALL display a green badge
9. WHEN request status is "declined", THE Mobile_App SHALL display a red badge
10. THE Mobile_App SHALL ensure status badges are readable in both light and dark themes

### Requirement 49: Confirmation Dialogs

**User Story:** As a user, I want confirmation dialogs for important actions, so that I don't accidentally perform destructive operations.

#### Acceptance Criteria

1. WHEN a user attempts to delete a service, THE Mobile_App SHALL display a confirmation dialog
2. WHEN a user attempts to cancel a booking, THE Mobile_App SHALL display a confirmation dialog
3. WHEN a user attempts to decline a service request, THE Mobile_App SHALL display a confirmation dialog
4. WHEN a user attempts to logout, THE Mobile_App SHALL display a confirmation dialog
5. THE Mobile_App SHALL provide "Confirm" and "Cancel" buttons in dialogs
6. WHEN a user taps "Cancel", THE Mobile_App SHALL close the dialog without action
7. WHEN a user taps "Confirm", THE Mobile_App SHALL proceed with the action
8. THE Mobile_App SHALL apply theme colors to confirmation dialogs

### Requirement 50: Accessibility

**User Story:** As a user with accessibility needs, I want the app to be accessible, so that I can use all features.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide accessibility labels for all interactive elements
2. THE Mobile_App SHALL ensure minimum touch target size of 44x44 pixels
3. THE Mobile_App SHALL ensure sufficient color contrast ratios (WCAG AA standard)
4. THE Mobile_App SHALL support screen readers on iOS and Android
5. THE Mobile_App SHALL provide alternative text for images
6. THE Mobile_App SHALL ensure form inputs have associated labels
7. THE Mobile_App SHALL support dynamic font sizing
8. THE Mobile_App SHALL ensure keyboard navigation works for all interactive elements
9. THE Mobile_App SHALL provide focus indicators for interactive elements

### Requirement 51: Performance Optimization

**User Story:** As a user, I want the app to load quickly, so that I can accomplish tasks efficiently.

#### Acceptance Criteria

1. THE Mobile_App SHALL lazy load images to improve initial load time
2. THE Mobile_App SHALL cache API responses where appropriate
3. THE Mobile_App SHALL debounce search inputs to reduce API calls
4. THE Mobile_App SHALL use pagination for long lists
5. THE Mobile_App SHALL compress images before upload
6. THE Mobile_App SHALL minimize re-renders using React optimization techniques
7. THE Mobile_App SHALL display skeleton screens while loading data
8. THE Mobile_App SHALL preload critical data on app launch

### Requirement 52: Security

**User Story:** As a user, I want my data to be secure, so that my information is protected.

#### Acceptance Criteria

1. THE Mobile_App SHALL store the Auth_Token securely in Async_Storage
2. THE Mobile_App SHALL never log sensitive information to console in production
3. THE Mobile_App SHALL use HTTPS for all API requests
4. THE Mobile_App SHALL validate all user inputs before submission
5. THE Mobile_App SHALL sanitize user-generated content before display
6. THE Mobile_App SHALL clear sensitive data from memory on logout
7. THE Mobile_App SHALL implement request timeouts to prevent hanging requests
8. THE Mobile_App SHALL handle authentication errors by redirecting to login

### Requirement 53: Analytics and Tracking

**User Story:** As a developer, I want to track app usage, so that I can understand user behavior and improve the app.

#### Acceptance Criteria

1. THE Mobile_App SHALL track screen views for all major screens
2. THE Mobile_App SHALL track user actions (login, logout, service creation, booking creation)
3. THE Mobile_App SHALL track API errors and failures
4. THE Mobile_App SHALL track app crashes and exceptions
5. THE Mobile_App SHALL respect user privacy and comply with data protection regulations
6. THE Mobile_App SHALL provide opt-out options for analytics tracking
7. THE Mobile_App SHALL not track personally identifiable information without consent

### Requirement 54: Deep Linking

**User Story:** As a user, I want to open specific content from external links, so that I can access shared services directly.

#### Acceptance Criteria

1. THE Mobile_App SHALL support deep links for service details (e.g., bizbridge://services/:id)
2. THE Mobile_App SHALL support deep links for artisan profiles (e.g., bizbridge://artisans/:id)
3. WHEN a user opens a deep link, THE Mobile_App SHALL navigate to the appropriate screen
4. WHEN a user opens a deep link while not authenticated, THE Mobile_App SHALL redirect to login then to the target screen
5. WHEN a deep link is invalid, THE Mobile_App SHALL display an error message
6. THE Mobile_App SHALL support universal links for iOS
7. THE Mobile_App SHALL support app links for Android

### Requirement 55: Push Notifications (Future Enhancement)

**User Story:** As a user, I want to receive notifications, so that I stay informed about important events.

#### Acceptance Criteria

1. THE Mobile_App SHALL request notification permissions from the user
2. THE Mobile_App SHALL register for push notifications using Expo Notifications
3. WHEN a customer receives a service request response, THE Mobile_App SHALL display a notification
4. WHEN an artisan receives a new service request, THE Mobile_App SHALL display a notification
5. WHEN a booking status changes, THE Mobile_App SHALL display a notification
6. WHEN a user receives a new message in a booking, THE Mobile_App SHALL display a notification
7. THE Mobile_App SHALL allow users to enable or disable notifications in settings
8. WHEN a user taps a notification, THE Mobile_App SHALL navigate to the relevant screen
9. THE Mobile_App SHALL display notification badges on app icon for unread items

### Requirement 56: Artisan Profile View

**User Story:** As a customer, I want to view artisan profiles, so that I can learn about their business.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an artisan profile screen accessible from service details
2. THE Mobile_App SHALL fetch artisan profile from `/api/users/:id`
3. THE Mobile_App SHALL display artisan profile image, business name, and contact name
4. THE Mobile_App SHALL display artisan location, specialties, and experience
5. THE Mobile_App SHALL display artisan ratings and total reviews
6. THE Mobile_App SHALL display artisan's listed services in a scrollable list
7. THE Mobile_App SHALL display business information (year established, CAC registration)
8. THE Mobile_App SHALL display social media links when available
9. WHEN a customer taps a service in the artisan profile, THE Mobile_App SHALL navigate to service details
10. THE Mobile_App SHALL display a loading indicator while fetching profile data
11. WHEN profile data fails to load, THE Mobile_App SHALL display an error message

### Requirement 57: Featured Artisans

**User Story:** As a customer, I want to see featured artisans, so that I can discover recommended service providers.

#### Acceptance Criteria

1. THE Mobile_App SHALL fetch featured artisans from `/api/users/featured`
2. THE Mobile_App SHALL display featured artisans on the home screen
3. THE Mobile_App SHALL display artisan profile image, business name, and rating
4. THE Mobile_App SHALL display artisan specialties
5. WHEN a customer taps a featured artisan, THE Mobile_App SHALL navigate to the artisan profile screen
6. THE Mobile_App SHALL display a loading indicator while fetching featured artisans
7. WHEN no featured artisans exist, THE Mobile_App SHALL hide the featured section

### Requirement 58: Service Deletion

**User Story:** As an artisan, I want to delete my services, so that I can remove outdated listings.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Delete Service" option in the service details screen for artisans
2. WHEN an artisan taps "Delete Service", THE Mobile_App SHALL display a confirmation dialog
3. WHEN the artisan confirms deletion, THE Mobile_App SHALL send a DELETE request to `/api/services/:id`
4. WHEN deletion succeeds, THE Mobile_App SHALL navigate back to the services list
5. WHEN deletion succeeds, THE Mobile_App SHALL display a success message
6. WHEN deletion fails, THE Mobile_App SHALL display an error message
7. THE Mobile_App SHALL display a loading indicator while processing deletion

### Requirement 59: Contract Acceptance

**User Story:** As a user, I want to accept booking contracts, so that I can formalize service agreements.

#### Acceptance Criteria

1. THE Mobile_App SHALL display contract terms in the booking details screen
2. THE Mobile_App SHALL display contract acceptance status for both customer and artisan
3. THE Mobile_App SHALL provide an "Accept Contract" button when the user has not accepted
4. WHEN a user taps "Accept Contract", THE Mobile_App SHALL send a PUT request to `/api/bookings/:id/accept-contract`
5. WHEN acceptance succeeds, THE Mobile_App SHALL update the contract acceptance status
6. WHEN both parties have accepted, THE Mobile_App SHALL display a "Contract Accepted" indicator
7. WHEN acceptance fails, THE Mobile_App SHALL display an error message
8. THE Mobile_App SHALL display a loading indicator while processing acceptance

### Requirement 60: Dispute Filing

**User Story:** As a user, I want to file disputes for problematic bookings, so that I can resolve issues.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "File Dispute" option in the booking details screen
2. WHEN a user taps "File Dispute", THE Mobile_App SHALL display a dispute form
3. THE Mobile_App SHALL require a dispute reason from predefined options
4. THE Mobile_App SHALL require a description field with maximum 1000 characters
5. WHEN a user submits the dispute, THE Mobile_App SHALL send a POST request to `/api/bookings/:id/dispute`
6. WHEN dispute filing succeeds, THE Mobile_App SHALL update the booking to show disputed status
7. WHEN dispute filing fails, THE Mobile_App SHALL display an error message
8. THE Mobile_App SHALL display a loading indicator while submitting the dispute
9. THE Mobile_App SHALL prevent duplicate disputes for the same booking

### Requirement 61: Request Retraction

**User Story:** As a customer, I want to retract service requests, so that I can cancel inquiries I no longer need.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Retract Request" option for pending service requests
2. WHEN a customer taps "Retract Request", THE Mobile_App SHALL display a confirmation dialog
3. WHEN the customer confirms retraction, THE Mobile_App SHALL send a PUT request to `/api/service-requests/:id/retract`
4. WHEN retraction succeeds, THE Mobile_App SHALL update the request status to "retracted"
5. WHEN retraction fails, THE Mobile_App SHALL display an error message
6. THE Mobile_App SHALL display a loading indicator while processing retraction
7. THE Mobile_App SHALL only allow retraction of pending requests

### Requirement 62: Booking Conversion from Service Request

**User Story:** As a customer, I want to convert accepted service requests to bookings, so that I can formalize agreements.

#### Acceptance Criteria

1. WHEN a service request is accepted, THE Mobile_App SHALL display a "Create Booking" button
2. WHEN a customer taps "Create Booking", THE Mobile_App SHALL navigate to a booking creation form
3. THE Mobile_App SHALL pre-populate the form with service request details
4. THE Mobile_App SHALL require scheduling information (start date, time)
5. WHEN the customer submits the form, THE Mobile_App SHALL send a POST request to `/api/bookings`
6. THE Mobile_App SHALL include the service request ID in the booking creation request
7. WHEN booking creation succeeds, THE Mobile_App SHALL update the service request status to "converted"
8. WHEN booking creation succeeds, THE Mobile_App SHALL navigate to the booking details screen
9. WHEN booking creation fails, THE Mobile_App SHALL display an error message
10. THE Mobile_App SHALL display a loading indicator while creating the booking

### Requirement 63: Service Active Status Toggle

**User Story:** As an artisan, I want to activate or deactivate my services, so that I can control visibility without deleting.

#### Acceptance Criteria

1. THE Mobile_App SHALL display service active status in the service details screen
2. THE Mobile_App SHALL provide a toggle switch to change active status
3. WHEN an artisan toggles the status, THE Mobile_App SHALL send a PUT request to `/api/services/:id`
4. WHEN the status update succeeds, THE Mobile_App SHALL update the UI to reflect the new status
5. WHEN the status update fails, THE Mobile_App SHALL display an error message
6. THE Mobile_App SHALL display a loading indicator while updating status
7. WHEN a service is inactive, THE Mobile_App SHALL display an "Inactive" badge

### Requirement 64: Password Change

**User Story:** As a user, I want to change my password, so that I can maintain account security.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Change Password" option in the profile screen
2. THE Mobile_App SHALL require current password, new password, and confirm new password fields
3. THE Mobile_App SHALL validate that new password is at least 6 characters
4. THE Mobile_App SHALL validate that new password and confirm password match
5. WHEN a user submits the form, THE Mobile_App SHALL send a PUT request to `/api/users/change-password`
6. WHEN password change succeeds, THE Mobile_App SHALL display a success message
7. WHEN password change fails, THE Mobile_App SHALL display an error message
8. THE Mobile_App SHALL display a loading indicator while processing the change
9. THE Mobile_App SHALL clear password fields after successful change

### Requirement 65: Sorting Options

**User Story:** As a customer, I want to sort search results, so that I can find services in my preferred order.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide sorting options on the service search screen
2. THE Mobile_App SHALL support sorting by "Newest First"
3. THE Mobile_App SHALL support sorting by "Highest Rated"
4. THE Mobile_App SHALL support sorting by "Most Reviews"
5. THE Mobile_App SHALL support sorting by "Price: Low to High"
6. THE Mobile_App SHALL support sorting by "Price: High to Low"
7. WHEN a user selects a sort option, THE Mobile_App SHALL reorder the search results
8. THE Mobile_App SHALL persist the selected sort option during the search session
9. THE Mobile_App SHALL display the active sort option

### Requirement 66: Booking Statistics

**User Story:** As an artisan, I want to see booking statistics, so that I can track my business performance.

#### Acceptance Criteria

1. THE Mobile_App SHALL display booking statistics on the artisan dashboard
2. THE Mobile_App SHALL fetch statistics from `/api/bookings/analytics`
3. THE Mobile_App SHALL display total bookings count
4. THE Mobile_App SHALL display completed bookings count
5. THE Mobile_App SHALL display cancelled bookings count
6. THE Mobile_App SHALL display completion rate as a percentage
7. THE Mobile_App SHALL display average rating
8. THE Mobile_App SHALL display total reviews count
9. THE Mobile_App SHALL display profile views count
10. THE Mobile_App SHALL use charts or visual indicators for statistics

### Requirement 67: Service Tags

**User Story:** As an artisan, I want to add tags to my services, so that customers can find them more easily.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a tag input field in the service creation form
2. THE Mobile_App SHALL provide a tag input field in the service edit form
3. THE Mobile_App SHALL allow adding multiple tags
4. THE Mobile_App SHALL display tags as removable chips
5. THE Mobile_App SHALL validate that tags do not exceed 50 characters each
6. THE Mobile_App SHALL display service tags on service cards
7. THE Mobile_App SHALL display service tags on service details screens
8. THE Mobile_App SHALL apply theme colors to tag chips

### Requirement 68: Favorite Services (Future Enhancement)

**User Story:** As a customer, I want to save favorite services, so that I can easily find them later.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Favorite" button on service details screens
2. WHEN a customer taps "Favorite", THE Mobile_App SHALL send a POST request to `/api/favorites`
3. WHEN a service is favorited, THE Mobile_App SHALL display a filled heart icon
4. WHEN a customer taps "Unfavorite", THE Mobile_App SHALL send a DELETE request to `/api/favorites/:id`
5. THE Mobile_App SHALL provide a "Favorites" screen listing all favorited services
6. THE Mobile_App SHALL fetch favorites from `/api/favorites`
7. THE Mobile_App SHALL display a loading indicator while processing favorite actions
8. WHEN favorite action fails, THE Mobile_App SHALL display an error message

### Requirement 69: App Version and Updates

**User Story:** As a user, I want to know the app version, so that I can verify I'm using the latest version.

#### Acceptance Criteria

1. THE Mobile_App SHALL display the app version in the profile or settings screen
2. THE Mobile_App SHALL display the build number
3. THE Mobile_App SHALL check for updates on app launch
4. WHEN a new version is available, THE Mobile_App SHALL display an update notification
5. THE Mobile_App SHALL provide a link to the app store for updates
6. THE Mobile_App SHALL allow users to dismiss update notifications
7. THE Mobile_App SHALL force updates for critical security patches

### Requirement 70: Help and Support

**User Story:** As a user, I want to access help information, so that I can learn how to use the app.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Help" or "Support" option in the profile screen
2. THE Mobile_App SHALL display frequently asked questions (FAQs)
3. THE Mobile_App SHALL provide contact information for support
4. THE Mobile_App SHALL provide a link to terms of service
5. THE Mobile_App SHALL provide a link to privacy policy
6. THE Mobile_App SHALL allow users to report bugs or issues
7. THE Mobile_App SHALL provide tutorial screens for first-time users

### Requirement 71: Onboarding Flow

**User Story:** As a new user, I want an onboarding experience, so that I understand how to use the app.

#### Acceptance Criteria

1. WHEN a user opens the app for the first time, THE Mobile_App SHALL display onboarding screens
2. THE Mobile_App SHALL display 3-5 onboarding screens explaining key features
3. THE Mobile_App SHALL provide "Next" and "Skip" buttons on onboarding screens
4. THE Mobile_App SHALL provide a "Get Started" button on the final onboarding screen
5. WHEN a user completes onboarding, THE Mobile_App SHALL navigate to the login screen
6. THE Mobile_App SHALL store onboarding completion status in Async_Storage
7. THE Mobile_App SHALL not show onboarding screens on subsequent app launches
8. THE Mobile_App SHALL apply theme colors to onboarding screens

### Requirement 72: Network Request Retry

**User Story:** As a user, I want automatic retry for failed requests, so that temporary network issues don't disrupt my experience.

#### Acceptance Criteria

1. WHEN a network request fails due to timeout, THE Mobile_App SHALL retry the request up to 3 times
2. THE Mobile_App SHALL use exponential backoff for retry delays
3. WHEN all retries fail, THE Mobile_App SHALL display an error message with manual retry option
4. THE Mobile_App SHALL not retry requests that fail with 4xx status codes
5. THE Mobile_App SHALL retry requests that fail with 5xx status codes
6. THE Mobile_App SHALL display retry attempt count to the user

### Requirement 73: Input Sanitization

**User Story:** As a developer, I want to sanitize user inputs, so that the app is protected from malicious content.

#### Acceptance Criteria

1. THE Mobile_App SHALL trim whitespace from all text inputs before submission
2. THE Mobile_App SHALL remove HTML tags from user-generated content
3. THE Mobile_App SHALL escape special characters in user-generated content
4. THE Mobile_App SHALL validate file types for image uploads
5. THE Mobile_App SHALL validate file sizes for image uploads (maximum 5MB)
6. THE Mobile_App SHALL prevent SQL injection attempts in search queries
7. THE Mobile_App SHALL prevent XSS attacks in user-generated content

### Requirement 74: Localization Support (Future Enhancement)

**User Story:** As a user, I want to use the app in my preferred language, so that I can understand all content.

#### Acceptance Criteria

1. THE Mobile_App SHALL support English as the default language
2. THE Mobile_App SHALL support Nigerian Pidgin as an additional language
3. THE Mobile_App SHALL detect device language settings
4. THE Mobile_App SHALL provide a language selector in settings
5. WHEN a user changes language, THE Mobile_App SHALL update all UI text immediately
6. THE Mobile_App SHALL store language preference in Async_Storage
7. THE Mobile_App SHALL use i18n library for translations
8. THE Mobile_App SHALL format dates and numbers according to selected locale

### Requirement 75: Splash Screen

**User Story:** As a user, I want to see a branded splash screen, so that I know the app is loading.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a splash screen on app launch
2. THE Mobile_App SHALL use the BizBridge logo on the splash screen
3. THE Mobile_App SHALL use brand colors (red and black) on the splash screen
4. THE Mobile_App SHALL display the splash screen for a minimum of 1 second
5. THE Mobile_App SHALL hide the splash screen after authentication check completes
6. THE Mobile_App SHALL support both light and dark splash screens based on device settings
7. THE Mobile_App SHALL use native splash screen APIs for optimal performance

### Requirement 76: App Icon and Branding

**User Story:** As a user, I want a recognizable app icon, so that I can easily find the app on my device.

#### Acceptance Criteria

1. THE Mobile_App SHALL use a professional app icon with BizBridge branding
2. THE Mobile_App SHALL provide app icons for all required sizes (iOS and Android)
3. THE Mobile_App SHALL use the red and black color scheme in the app icon
4. THE Mobile_App SHALL include the app name "BizBridge" in the icon or as text below
5. THE Mobile_App SHALL use adaptive icons for Android
6. THE Mobile_App SHALL ensure the icon is visible on various background colors

### Requirement 77: Error Logging

**User Story:** As a developer, I want to log errors, so that I can debug issues in production.

#### Acceptance Criteria

1. THE Mobile_App SHALL log all unhandled exceptions
2. THE Mobile_App SHALL log API request failures with status codes
3. THE Mobile_App SHALL log authentication failures
4. THE Mobile_App SHALL log navigation errors
5. THE Mobile_App SHALL include timestamp and user context in error logs
6. THE Mobile_App SHALL send error logs to a logging service (e.g., Sentry)
7. THE Mobile_App SHALL not log sensitive information (passwords, tokens)
8. THE Mobile_App SHALL provide error log viewing in development mode

### Requirement 78: Keyboard Handling

**User Story:** As a user, I want the keyboard to behave properly, so that I can easily input text.

#### Acceptance Criteria

1. THE Mobile_App SHALL dismiss the keyboard when tapping outside input fields
2. THE Mobile_App SHALL scroll content to keep focused input visible above keyboard
3. THE Mobile_App SHALL use appropriate keyboard types for different inputs (email, phone, numeric)
4. THE Mobile_App SHALL provide "Done" or "Next" buttons on the keyboard
5. THE Mobile_App SHALL move focus to the next input when "Next" is tapped
6. THE Mobile_App SHALL submit forms when "Done" is tapped on the last input
7. THE Mobile_App SHALL prevent keyboard from covering important UI elements

### Requirement 79: Biometric Authentication (Future Enhancement)

**User Story:** As a user, I want to use biometric authentication, so that I can login quickly and securely.

#### Acceptance Criteria

1. THE Mobile_App SHALL detect if biometric authentication is available on the device
2. THE Mobile_App SHALL prompt users to enable biometric login after first successful login
3. WHEN biometric login is enabled, THE Mobile_App SHALL store credentials securely
4. WHEN a user opens the app, THE Mobile_App SHALL offer biometric authentication
5. WHEN biometric authentication succeeds, THE Mobile_App SHALL navigate to the dashboard
6. WHEN biometric authentication fails, THE Mobile_App SHALL fall back to password login
7. THE Mobile_App SHALL support Face ID on iOS
8. THE Mobile_App SHALL support fingerprint authentication on Android
9. THE Mobile_App SHALL provide an option to disable biometric login in settings

### Requirement 80: Share Functionality

**User Story:** As a user, I want to share services, so that I can recommend them to others.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a "Share" button on service details screens
2. WHEN a user taps "Share", THE Mobile_App SHALL open the native share dialog
3. THE Mobile_App SHALL generate a shareable message with service title and deep link
4. THE Mobile_App SHALL support sharing via SMS, email, WhatsApp, and social media
5. THE Mobile_App SHALL include service image in share content when supported
6. THE Mobile_App SHALL track share events for analytics
7. THE Mobile_App SHALL apply theme colors to share buttons

## Special Requirements Guidance

### Parser and Serializer Requirements

This mobile application does not implement custom parsers or serializers beyond standard JSON parsing provided by the JavaScript runtime and Axios library. All data exchange with the Backend_API uses JSON format, which is handled automatically.

### Round-Trip Properties

While this application does not implement custom parsers, the following round-trip properties should be verified during testing:

1. **Authentication Flow**: Login → Store Token → Retrieve Token → Authenticate Request → Success
2. **Service Creation**: Create Service → Fetch Service → Data Matches Input
3. **Profile Update**: Update Profile → Fetch Profile → Data Matches Input
4. **Image Upload**: Select Image → Upload → Receive URL → Display Image → Image Matches Original

### Data Integrity Properties

The following invariants must be maintained throughout the application:

1. **Authentication State**: User is either authenticated (has valid token) or not authenticated (no token or invalid token)
2. **Role Consistency**: User role determines available features and navigation options
3. **Status Transitions**: Booking and service request statuses follow valid state transitions
4. **Data Synchronization**: Local state matches backend state after successful API operations

## Implementation Notes

### Technology Stack

- **Framework**: Expo SDK (latest stable version)
- **Language**: TypeScript with strict mode enabled
- **Navigation**: React Navigation v6+
- **State Management**: React Context API and custom hooks
- **HTTP Client**: Axios
- **Storage**: Expo AsyncStorage
- **UI Library**: React Native Paper or React Native Elements
- **Icons**: Expo Vector Icons (@expo/vector-icons)
- **Image Handling**: Expo Image Picker
- **Forms**: React Hook Form (optional)
- **Date/Time**: date-fns or dayjs

### Development Priorities

1. **Phase 1**: Project setup, authentication, navigation, and theme system
2. **Phase 2**: Core customer features (home, search, service details, service requests)
3. **Phase 3**: Core artisan features (dashboard, service management, request inbox)
4. **Phase 4**: Booking management for both roles
5. **Phase 5**: Profile management, reviews, and messaging
6. **Phase 6**: Polish, optimization, and testing
7. **Phase 7**: Future enhancements (push notifications, favorites, biometrics)

### API Integration Notes

All API endpoints are already implemented in the backend. The mobile app must:
- Use the same endpoint paths as the web application
- Send the same request payloads
- Handle the same response formats
- Include JWT token in Authorization header for authenticated requests
- Handle all HTTP status codes appropriately

### Design Consistency

The mobile app should maintain visual consistency with the web application while optimizing for mobile UX:
- Use the same red and black color scheme
- Adapt layouts for smaller screens
- Use touch-friendly controls (minimum 44x44 pixels)
- Implement mobile-specific patterns (bottom sheets, swipe gestures)
- Provide better icons than the web version
- Use smooth animations and transitions

## Conclusion

This requirements document provides a comprehensive specification for the BizBridge mobile application. All requirements follow EARS patterns and INCOSE quality rules to ensure clarity, testability, and completeness. The mobile app will provide feature parity with the web application while delivering a superior mobile user experience through modern UI design, intuitive navigation, and mobile-optimized interactions.
