# Design Document: BizBridge Mobile Application

## Overview

### Purpose

The BizBridge mobile application is a cross-platform TypeScript Expo app that connects Nigerian artisans with customers seeking handcrafted products and services. This design document outlines the technical architecture, component structure, data flow, and implementation patterns for the mobile app that provides feature parity with the existing web application while delivering a superior mobile user experience.

### Scope

This design covers the core setup and infrastructure phase including:
- Project structure and TypeScript configuration
- Constants architecture for categories, locations, and configuration
- Comprehensive type system for all data models
- Theme system with light/dark mode support
- Reusable component library
- Custom hooks for API integration
- Navigation architecture
- API integration layer
- State management patterns
- Modern UI/UX design patterns

### Technology Stack

- **Framework**: Expo SDK 50+ (latest stable)
- **Language**: TypeScript 5.x with strict mode
- **Navigation**: React Navigation v6
- **HTTP Client**: Axios 1.x
- **Storage**: @react-native-async-storage/async-storage
- **UI Library**: React Native Paper 5.x
- **Icons**: @expo/vector-icons
- **Image Handling**: expo-image-picker
- **Date Utilities**: date-fns
- **Form Management**: React Hook Form (optional)

### Design Principles

1. **Type Safety**: Strict TypeScript throughout with no `any` types
2. **Modularity**: Clear separation of concerns with reusable components
3. **Performance**: Lazy loading, caching, and optimization techniques
4. **Accessibility**: WCAG AA compliance with screen reader support
5. **Consistency**: Unified design language across all screens
6. **Mobile-First**: Touch-optimized interactions and responsive layouts
7. **Maintainability**: Clear code organization and documentation


## Architecture

### High-Level Architecture

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (Screens, Components, Navigation, Theme)               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                   │
│        (Custom Hooks, Context Providers, Utils)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                      │
│         (API Client, Axios Interceptors, Cache)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend REST API                      │
│              (Node.js/Express/MongoDB)                   │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
mobile/
├── app.json                    # Expo configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies
├── App.tsx                    # Root component
├── src/
│   ├── constants/             # Static configuration
│   │   ├── api.ts            # API endpoints and base URL
│   │   ├── categories.ts     # 26+ craft categories
│   │   ├── locations.ts      # Lagos LGAs and localities
│   │   ├── statuses.ts       # Booking/request statuses
│   │   └── config.ts         # App configuration
│   ├── types/                 # TypeScript definitions
│   │   ├── models.ts         # Data model interfaces
│   │   ├── api.ts            # API request/response types
│   │   ├── navigation.ts     # Navigation param types
│   │   └── theme.ts          # Theme configuration types
│   ├── theme/                 # Theme system
│   │   ├── colors.ts         # Color palette
│   │   ├── typography.ts     # Font styles
│   │   ├── spacing.ts        # Spacing scale
│   │   ├── themes.ts         # Light/dark themes
│   │   └── ThemeContext.tsx  # Theme provider
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Generic components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Picker.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── service/          # Service-specific
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceList.tsx
│   │   │   └── ServiceGallery.tsx
│   │   ├── booking/          # Booking-specific
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingList.tsx
│   │   │   └── BookingStatus.tsx
│   │   └── request/          # Request-specific
│   │       ├── RequestCard.tsx
│   │       └── RequestList.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts        # Authentication
│   │   ├── useServices.ts    # Service operations
│   │   ├── useBookings.ts    # Booking operations
│   │   ├── useServiceRequests.ts  # Request operations
│   │   ├── useProfile.ts     # Profile operations
│   │   ├── useSearch.ts      # Search and filtering
│   │   └── useTheme.ts       # Theme management
│   ├── screens/               # Screen components
│   │   ├── auth/             # Authentication screens
│   │   ├── customer/         # Customer screens
│   │   ├── artisan/          # Artisan screens
│   │   ├── shared/           # Shared screens
│   │   └── profile/          # Profile screens
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.tsx  # Root navigator
│   │   ├── AuthNavigator.tsx # Auth stack
│   │   ├── CustomerNavigator.tsx  # Customer tabs
│   │   ├── ArtisanNavigator.tsx   # Artisan tabs
│   │   └── linking.ts        # Deep linking config
│   ├── services/              # API services
│   │   ├── api.ts            # Axios instance
│   │   ├── auth.service.ts   # Auth endpoints
│   │   ├── service.service.ts # Service endpoints
│   │   ├── booking.service.ts # Booking endpoints
│   │   └── user.service.ts   # User endpoints
│   ├── utils/                 # Utility functions
│   │   ├── validation.ts     # Input validation
│   │   ├── formatting.ts     # Data formatting
│   │   ├── storage.ts        # AsyncStorage helpers
│   │   └── helpers.ts        # General helpers
│   └── context/               # React contexts
│       ├── AuthContext.tsx   # Auth state
│       └── AppContext.tsx    # Global app state
└── assets/                    # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

### Data Flow Architecture

```
User Interaction → Screen Component → Custom Hook → API Service → Backend
                                    ↓
                              Context/State
                                    ↓
                            UI Update/Re-render
```

1. **User Interaction**: User taps button, enters text, etc.
2. **Screen Component**: Handles UI events, calls custom hooks
3. **Custom Hook**: Manages state, calls API services
4. **API Service**: Makes HTTP requests via Axios
5. **Backend**: Processes request, returns response
6. **State Update**: Hook updates local state/context
7. **UI Re-render**: React re-renders affected components


## Components and Interfaces

### Constants Architecture

#### API Configuration (`constants/api.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api' 
    : 'https://api.bizbridge.ng/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER_CUSTOMER: '/auth/register/customer',
  REGISTER_ARTISAN: '/auth/register/artisan',
  ME: '/auth/me',
  
  // Services
  SERVICES: '/services',
  SERVICES_SEARCH: '/services/search',
  SERVICES_FEATURED: '/services/featured',
  MY_SERVICES: '/services/my-services',
  
  // Bookings
  BOOKINGS: '/bookings',
  MY_BOOKINGS: '/bookings/my-bookings',
  MY_WORK: '/bookings/my-work',
  BOOKING_ANALYTICS: '/bookings/analytics',
  
  // Service Requests
  SERVICE_REQUESTS: '/service-requests',
  MY_REQUESTS: '/service-requests/my-requests',
  REQUEST_INBOX: '/service-requests/inbox',
  
  // Users
  USERS: '/users',
  PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password',
  FEATURED_ARTISANS: '/users/featured',
  
  // Upload
  UPLOAD: '/upload',
} as const;
```

#### Categories Configuration (`constants/categories.ts`)

```typescript
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from @expo/vector-icons
  color: string;
}

export const JOB_CATEGORIES: Category[] = [
  {
    id: 'woodworking',
    name: 'Woodworking',
    description: 'Custom furniture, carpentry, wood carving',
    icon: 'hammer-outline',
    color: '#8B4513',
  },
  {
    id: 'pottery',
    name: 'Pottery & Ceramics',
    description: 'Handmade pottery, ceramic art, clay work',
    icon: 'color-palette-outline',
    color: '#CD853F',
  },
  {
    id: 'jewelry',
    name: 'Jewelry Making',
    description: 'Custom jewelry, beadwork, metalwork',
    icon: 'diamond-outline',
    color: '#FFD700',
  },
  {
    id: 'textiles',
    name: 'Textiles & Weaving',
    description: 'Fabric weaving, textile design, traditional cloth',
    icon: 'shirt-outline',
    color: '#4B0082',
  },
  {
    id: 'leatherwork',
    name: 'Leatherwork',
    description: 'Leather goods, bags, shoes, accessories',
    icon: 'briefcase-outline',
    color: '#654321',
  },
  {
    id: 'metalwork',
    name: 'Metalwork',
    description: 'Metal sculpture, welding, ironwork',
    icon: 'construct-outline',
    color: '#708090',
  },
  {
    id: 'glasswork',
    name: 'Glasswork',
    description: 'Stained glass, glass blowing, glass art',
    icon: 'wine-outline',
    color: '#87CEEB',
  },
  {
    id: 'painting',
    name: 'Painting & Drawing',
    description: 'Canvas art, murals, portraits, illustrations',
    icon: 'brush-outline',
    color: '#FF6347',
  },
  {
    id: 'sculpture',
    name: 'Sculpture',
    description: '3D art, stone carving, modeling',
    icon: 'cube-outline',
    color: '#696969',
  },
  {
    id: 'basketry',
    name: 'Basketry',
    description: 'Basket weaving, wicker work, rattan crafts',
    icon: 'basket-outline',
    color: '#D2691E',
  },
  {
    id: 'candle-making',
    name: 'Candle Making',
    description: 'Handmade candles, wax art, scented candles',
    icon: 'flame-outline',
    color: '#FFA500',
  },
  {
    id: 'soap-making',
    name: 'Soap Making',
    description: 'Handmade soaps, natural cosmetics',
    icon: 'water-outline',
    color: '#98FB98',
  },
  {
    id: 'paper-crafts',
    name: 'Paper Crafts',
    description: 'Origami, paper mache, card making',
    icon: 'document-outline',
    color: '#F0E68C',
  },
  {
    id: 'embroidery',
    name: 'Embroidery',
    description: 'Hand embroidery, cross-stitch, needlework',
    icon: 'flower-outline',
    color: '#FF69B4',
  },
  {
    id: 'knitting',
    name: 'Knitting & Crochet',
    description: 'Knitted items, crochet work, yarn crafts',
    icon: 'grid-outline',
    color: '#DDA0DD',
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Event photography, portraits, product shots',
    icon: 'camera-outline',
    color: '#000000',
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Logo design, branding, digital art',
    icon: 'color-fill-outline',
    color: '#FF1493',
  },
  {
    id: 'fashion-design',
    name: 'Fashion Design',
    description: 'Custom clothing, tailoring, fashion accessories',
    icon: 'shirt-outline',
    color: '#9370DB',
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    description: 'Home decor, space planning, styling',
    icon: 'home-outline',
    color: '#20B2AA',
  },
  {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Event coordination, decoration, management',
    icon: 'calendar-outline',
    color: '#FF4500',
  },
  {
    id: 'catering',
    name: 'Catering',
    description: 'Food catering, baking, meal preparation',
    icon: 'restaurant-outline',
    color: '#FF6347',
  },
  {
    id: 'music',
    name: 'Music & Performance',
    description: 'Live music, DJ services, entertainment',
    icon: 'musical-notes-outline',
    color: '#8A2BE2',
  },
  {
    id: 'beauty',
    name: 'Beauty Services',
    description: 'Makeup, hair styling, beauty treatments',
    icon: 'sparkles-outline',
    color: '#FF1493',
  },
  {
    id: 'repair',
    name: 'Repair Services',
    description: 'Electronics, appliances, general repairs',
    icon: 'build-outline',
    color: '#4682B4',
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscaping',
    description: 'Garden design, plant care, landscaping',
    icon: 'leaf-outline',
    color: '#228B22',
  },
  {
    id: 'other',
    name: 'Other Crafts',
    description: 'Miscellaneous handcrafted services',
    icon: 'ellipsis-horizontal-outline',
    color: '#808080',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return JOB_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryIcon = (id: string): string => {
  return getCategoryById(id)?.icon || 'help-circle-outline';
};
```

#### Locations Configuration (`constants/locations.ts`)

```typescript
export interface Location {
  id: string;
  name: string;
  region: 'mainland' | 'island';
  localities?: string[];
}

export const LAGOS_LGAS: Location[] = [
  {
    id: 'alimosho',
    name: 'Alimosho',
    region: 'mainland',
    localities: ['Ikotun', 'Egbeda', 'Idimu', 'Iyana-Ipaja'],
  },
  {
    id: 'ajeromi-ifelodun',
    name: 'Ajeromi-Ifelodun',
    region: 'mainland',
    localities: ['Ajegunle', 'Boundary', 'Olodi'],
  },
  {
    id: 'kosofe',
    name: 'Kosofe',
    region: 'mainland',
    localities: ['Ketu', 'Ikosi', 'Oworonshoki', 'Anthony'],
  },
  {
    id: 'mushin',
    name: 'Mushin',
    region: 'mainland',
    localities: ['Idi-Oro', 'Papa Ajao', 'Odi-Olowo'],
  },
  {
    id: 'oshodi-isolo',
    name: 'Oshodi-Isolo',
    region: 'mainland',
    localities: ['Oshodi', 'Isolo', 'Okota', 'Mafoluku'],
  },
  {
    id: 'ojo',
    name: 'Ojo',
    region: 'mainland',
    localities: ['Ojo Town', 'Ajangbadi', 'Okokomaiko'],
  },
  {
    id: 'ikorodu',
    name: 'Ikorodu',
    region: 'mainland',
    localities: ['Ikorodu Town', 'Igbogbo', 'Imota'],
  },
  {
    id: 'surulere',
    name: 'Surulere',
    region: 'mainland',
    localities: ['Surulere', 'Adeniran Ogunsanya', 'Ojuelegba'],
  },
  {
    id: 'agege',
    name: 'Agege',
    region: 'mainland',
    localities: ['Agege', 'Dopemu', 'Orile-Agege'],
  },
  {
    id: 'ifako-ijaiye',
    name: 'Ifako-Ijaiye',
    region: 'mainland',
    localities: ['Ifako', 'Ijaiye', 'Fagba', 'Iju'],
  },
  {
    id: 'somolu',
    name: 'Somolu',
    region: 'mainland',
    localities: ['Somolu', 'Bariga', 'Gbagada Phase 1'],
  },
  {
    id: 'amuwo-odofin',
    name: 'Amuwo-Odofin',
    region: 'mainland',
    localities: ['Festac', 'Amuwo-Odofin', 'Mile 2'],
  },
  {
    id: 'lagos-mainland',
    name: 'Lagos Mainland',
    region: 'mainland',
    localities: ['Yaba', 'Ebute Metta', 'Oyingbo'],
  },
  {
    id: 'ikeja',
    name: 'Ikeja',
    region: 'mainland',
    localities: ['Ikeja GRA', 'Allen Avenue', 'Alausa', 'Ogba'],
  },
  {
    id: 'eti-osa',
    name: 'Eti-Osa',
    region: 'island',
    localities: ['Lekki', 'Ajah', 'Victoria Island', 'Ikoyi'],
  },
  {
    id: 'lagos-island',
    name: 'Lagos Island',
    region: 'island',
    localities: ['Lagos Island', 'Marina', 'Broad Street'],
  },
  {
    id: 'apapa',
    name: 'Apapa',
    region: 'mainland',
    localities: ['Apapa', 'Ajegunle', 'Kirikiri'],
  },
  {
    id: 'badagry',
    name: 'Badagry',
    region: 'mainland',
    localities: ['Badagry Town', 'Ajara', 'Ikoga'],
  },
  {
    id: 'epe',
    name: 'Epe',
    region: 'mainland',
    localities: ['Epe Town', 'Ejinrin', 'Poka'],
  },
  {
    id: 'ibeju-lekki',
    name: 'Ibeju-Lekki',
    region: 'island',
    localities: ['Ibeju', 'Lekki Free Zone', 'Eleko'],
  },
];

export const getLocationById = (id: string): Location | undefined => {
  return LAGOS_LGAS.find(loc => loc.id === id);
};

export const getLocalitiesByLGA = (lgaId: string): string[] => {
  return getLocationById(lgaId)?.localities || [];
};
```

#### Status Configuration (`constants/statuses.ts`)

```typescript
export const PRICING_TYPES = ['fixed', 'negotiate', 'categorized'] as const;
export type PricingType = typeof PRICING_TYPES[number];

export const BOOKING_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
  'disputed',
] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

export const SERVICE_REQUEST_STATUSES = [
  'pending',
  'viewed',
  'accepted',
  'declined',
  'converted',
  'retracted',
] as const;
export type ServiceRequestStatus = typeof SERVICE_REQUEST_STATUSES[number];

export const CANCELLATION_REASONS = [
  'Changed my mind',
  'Found another artisan',
  'Service no longer needed',
  'Price too high',
  'Scheduling conflict',
  'Other',
] as const;

export const DISPUTE_REASONS = [
  'Service not delivered',
  'Poor quality work',
  'Payment issue',
  'Communication problem',
  'Breach of agreement',
  'Other',
] as const;

export const USER_ROLES = ['customer', 'artisan'] as const;
export type UserRole = typeof USER_ROLES[number];
```


### TypeScript Type System

#### Data Models (`types/models.ts`)

```typescript
import { PricingType, BookingStatus, ServiceRequestStatus, UserRole } from '../constants/statuses';

export interface User {
  _id: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  
  // Customer-specific fields
  fullName?: string;
  location?: {
    lga: string;
    locality?: string;
  };
  
  // Artisan-specific fields
  businessName?: string;
  contactName?: string;
  phoneNumber?: string;
  businessDescription?: string;
  specialties?: string[];
  experience?: number;
  cacRegistration?: string;
  yearEstablished?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  ratings?: {
    average: number;
    count: number;
  };
  analytics?: {
    profileViews: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    completionRate: number;
  };
}

export interface PricingCategory {
  category: string;
  price: number;
  duration?: string;
  description?: string;
}

export interface Service {
  _id: string;
  artisan: string | User;
  title: string;
  description: string;
  category: string;
  images: string[];
  pricingType: PricingType;
  basePrice?: number;
  baseDuration?: string;
  pricingCategories?: PricingCategory[];
  locations: {
    lga: string;
    localities?: string[];
  }[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingMessage {
  sender: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

export interface Booking {
  _id: string;
  customer: string | User;
  artisan: string | User;
  service: string | Service;
  title: string;
  description: string;
  status: BookingStatus;
  scheduledStartDate: string;
  scheduledEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  agreedTerms: {
    price: number;
    duration: string;
    location: string;
    additionalTerms?: string;
  };
  contractAcceptance: {
    customer: boolean;
    artisan: boolean;
  };
  messages: BookingMessage[];
  cancellation?: {
    cancelledBy: UserRole;
    reason: string;
    description?: string;
    cancelledAt: string;
  };
  dispute?: {
    filedBy: UserRole;
    reason: string;
    description: string;
    filedAt: string;
    status: 'open' | 'resolved';
  };
  review?: {
    rating: number;
    comment?: string;
    reviewedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  _id: string;
  customer: string | User;
  artisan: string | User;
  service: string | Service;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  preferredSchedule?: string;
  specialRequirements?: string;
  selectedCategory?: string;
  response?: {
    message: string;
    proposedTerms?: string;
    respondedAt: string;
  };
  declineReason?: string;
  convertedBooking?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  booking: string;
  reviewer: string | User;
  reviewee: string | User;
  rating: number;
  comment?: string;
  createdAt: string;
}
```

#### API Types (`types/api.ts`)

```typescript
import { User, Service, Booking, ServiceRequest } from './models';
import { UserRole } from '../constants/statuses';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterCustomerRequest {
  fullName: string;
  email: string;
  password: string;
  location: {
    lga: string;
    locality?: string;
  };
}

export interface RegisterArtisanRequest {
  contactName: string;
  businessName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: {
    lga: string;
    locality?: string;
  };
}

// Services
export interface SearchServicesParams {
  query?: string;
  category?: string;
  lga?: string;
  pricingType?: string;
  sortBy?: 'newest' | 'rating' | 'reviews' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: string;
  images: string[];
  pricingType: string;
  basePrice?: number;
  baseDuration?: string;
  pricingCategories?: Array<{
    category: string;
    price: number;
    duration?: string;
    description?: string;
  }>;
  locations: Array<{
    lga: string;
    localities?: string[];
  }>;
  tags: string[];
}

// Bookings
export interface CreateBookingRequest {
  service: string;
  title: string;
  description: string;
  scheduledStartDate: string;
  scheduledEndDate?: string;
  agreedTerms: {
    price: number;
    duration: string;
    location: string;
    additionalTerms?: string;
  };
  serviceRequest?: string;
}

export interface BookingAnalytics {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  totalServices?: number;
  pendingRequests?: number;
}

// Service Requests
export interface CreateServiceRequestRequest {
  service: string;
  title: string;
  description: string;
  preferredSchedule?: string;
  specialRequirements?: string;
  selectedCategory?: string;
}

export interface RespondToRequestRequest {
  message: string;
  proposedTerms?: string;
}

export interface DeclineRequestRequest {
  reason: string;
}

// Profile
export interface UpdateProfileRequest {
  fullName?: string;
  businessName?: string;
  contactName?: string;
  phoneNumber?: string;
  businessDescription?: string;
  location?: {
    lga: string;
    locality?: string;
  };
  specialties?: string[];
  experience?: number;
  cacRegistration?: string;
  yearEstablished?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Upload
export interface UploadResponse {
  url: string;
  filename: string;
}
```

#### Navigation Types (`types/navigation.ts`)

```typescript
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerTabParamList>;
  Artisan: NavigatorScreenParams<ArtisanTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  RegisterChoice: undefined;
  RegisterCustomer: undefined;
  RegisterArtisan: undefined;
  Onboarding: undefined;
};

export type CustomerTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Requests: undefined;
  Profile: undefined;
};

export type ArtisanTabParamList = {
  Home: undefined;
  MyWork: undefined;
  RequestInbox: undefined;
  MyServices: undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  ServiceDetails: { serviceId: string };
  ServiceRequest: { serviceId: string };
  BookingDetails: { bookingId: string };
  RequestDetails: { requestId: string };
  ArtisanProfile: { artisanId: string };
  CreateBooking: { requestId: string };
  EditProfile: undefined;
  ChangePassword: undefined;
  Help: undefined;
};

export type ArtisanStackParamList = {
  ArtisanTabs: NavigatorScreenParams<ArtisanTabParamList>;
  ServiceDetails: { serviceId: string };
  AddService: undefined;
  EditService: { serviceId: string };
  BookingDetails: { bookingId: string };
  RequestDetails: { requestId: string };
  EditProfile: undefined;
  ChangePassword: undefined;
  Help: undefined;
};
```

#### Theme Types (`types/theme.ts`)

```typescript
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;
  body1: TextStyle;
  body2: TextStyle;
  caption: TextStyle;
  button: TextStyle;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
  };
}

export type ThemeMode = 'light' | 'dark';
```


## Data Models

### Theme System Design

#### Color Palette (`theme/colors.ts`)

The application uses a red and black color scheme consistent with the web application:

```typescript
export const COLORS = {
  // Primary colors (Red)
  primary: {
    main: '#DC143C',      // Crimson red
    light: '#FF6B6B',     // Light red
    dark: '#B22222',      // Dark red
    contrast: '#FFFFFF',  // White text on red
  },
  
  // Secondary colors (Black/Gray)
  secondary: {
    main: '#1A1A1A',      // Near black
    light: '#333333',     // Dark gray
    dark: '#000000',      // Pure black
    contrast: '#FFFFFF',  // White text on black
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  
  // Semantic colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

export const lightThemeColors: ThemeColors = {
  primary: COLORS.primary.main,
  secondary: COLORS.secondary.main,
  background: COLORS.neutral.white,
  surface: COLORS.neutral.gray100,
  card: COLORS.neutral.white,
  text: COLORS.neutral.gray900,
  textSecondary: COLORS.neutral.gray600,
  border: COLORS.neutral.gray300,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
  info: COLORS.info,
  disabled: COLORS.neutral.gray400,
  placeholder: COLORS.neutral.gray500,
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const darkThemeColors: ThemeColors = {
  primary: COLORS.primary.light,
  secondary: COLORS.neutral.gray300,
  background: COLORS.neutral.gray900,
  surface: COLORS.neutral.gray800,
  card: COLORS.neutral.gray800,
  text: COLORS.neutral.white,
  textSecondary: COLORS.neutral.gray400,
  border: COLORS.neutral.gray700,
  error: COLORS.error,
  success: COLORS.success,
  warning: COLORS.warning,
  info: COLORS.info,
  disabled: COLORS.neutral.gray600,
  placeholder: COLORS.neutral.gray500,
  backdrop: 'rgba(0, 0, 0, 0.7)',
};
```

#### Typography Scale (`theme/typography.ts`)

```typescript
import { TextStyle } from 'react-native';

export const FONT_FAMILIES = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography: ThemeTypography = {
  h1: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxxl,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xxl,
    lineHeight: 32,
    fontWeight: '700',
  },
  h3: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: FONT_SIZES.xl,
    lineHeight: 28,
    fontWeight: '600',
  },
  h4: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.lg,
    lineHeight: 24,
    fontWeight: '600',
  },
  h5: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    fontWeight: '500',
  },
  h6: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    fontWeight: '500',
  },
  body1: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: '400',
  },
  body2: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    fontWeight: '400',
  },
  caption: {
    fontFamily: FONT_FAMILIES.regular,
    fontSize: FONT_SIZES.xs,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontFamily: FONT_FAMILIES.medium,
    fontSize: FONT_SIZES.md,
    lineHeight: 24,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
};
```

#### Spacing System (`theme/spacing.ts`)

```typescript
export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

#### Theme Configuration (`theme/themes.ts`)

```typescript
import { Theme } from '../types/theme';
import { lightThemeColors, darkThemeColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

const commonTheme = {
  typography,
  spacing,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const lightTheme: Theme = {
  dark: false,
  colors: lightThemeColors,
  ...commonTheme,
};

export const darkTheme: Theme = {
  dark: true,
  colors: darkThemeColors,
  ...commonTheme,
};
```

#### Theme Context (`theme/ThemeContext.tsx`)

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode } from '../types/theme';
import { lightTheme, darkTheme } from './themes';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@bizbridge_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeModeState(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### Component Architecture

#### Button Component (`components/common/Button.tsx`)

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size
    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
      medium: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg },
      large: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl },
    };

    // Variant
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.disabled : theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.disabled : theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.button,
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: disabled ? theme.colors.disabled : theme.colors.primary },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
```

#### Card Component (`components/common/Card.tsx`)

```typescript
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  padding?: keyof ThemeSpacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevated = true,
  padding = 'md',
}) => {
  const { theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[padding],
    ...(elevated && theme.shadows.md),
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
};
```

#### Input Component (`components/common/Input.tsx`)

```typescript
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text, ...theme.typography.body2 }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
            color: theme.colors.text,
            ...theme.typography.body1,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error, ...theme.typography.caption }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  error: {
    marginTop: 4,
  },
});
```


#### Service Card Component (`components/service/ServiceCard.tsx`)

```typescript
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Service } from '../../types/models';
import { getCategoryIcon } from '../../constants/categories';
import { Card } from '../common/Card';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { theme } = useTheme();
  
  const artisan = typeof service.artisan === 'object' ? service.artisan : null;
  const imageUrl = service.images[0] || 'https://via.placeholder.com/300';
  
  const formatPrice = () => {
    if (service.pricingType === 'fixed' && service.basePrice) {
      return `₦${service.basePrice.toLocaleString()}`;
    } else if (service.pricingType === 'categorized' && service.pricingCategories) {
      const prices = service.pricingCategories.map(c => c.price);
      return `₦${Math.min(...prices).toLocaleString()} - ₦${Math.max(...prices).toLocaleString()}`;
    }
    return 'Price on consultation';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card padding="sm">
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons 
              name={getCategoryIcon(service.category)} 
              size={20} 
              color={theme.colors.primary} 
            />
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
              {service.title}
            </Text>
          </View>
          
          {artisan && (
            <Text style={[styles.artisan, { color: theme.colors.textSecondary }]}>
              by {artisan.businessName || artisan.contactName}
            </Text>
          )}
          
          <View style={styles.footer}>
            <Text style={[styles.price, { color: theme.colors.primary }]}>
              {formatPrice()}
            </Text>
            <View style={styles.location}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={[styles.locationText, { color: theme.colors.textSecondary }]}>
                {service.locations[0]?.lga}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  artisan: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
});
```

### Custom Hooks Design

#### useAuth Hook (`hooks/useAuth.ts`)

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth.service';
import { User } from '../types/models';
import { LoginRequest, RegisterCustomerRequest, RegisterArtisanRequest } from '../types/api';

const TOKEN_KEY = '@bizbridge_token';
const USER_KEY = '@bizbridge_user';

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  registerCustomer: (data: RegisterCustomerRequest) => Promise<void>;
  registerArtisan: (data: RegisterArtisanRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to load auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAuth = async (token: string, user: User) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const clearAuth = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setToken(null);
    setUser(null);
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerCustomer = async (data: RegisterCustomerRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerCustomer(data);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerArtisan = async (data: RegisterArtisanRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerArtisan(data);
      await saveAuth(response.token, response.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await clearAuth();
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response));
    } catch (err: any) {
      console.error('Failed to refresh user:', err);
      if (err.response?.status === 401) {
        await clearAuth();
      }
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    registerCustomer,
    registerArtisan,
    logout,
    refreshUser,
    isAuthenticated: !!token && !!user,
  };
};
```

#### useServices Hook (`hooks/useServices.ts`)

```typescript
import { useState, useEffect } from 'react';
import { serviceService } from '../services/service.service';
import { Service } from '../types/models';
import { SearchServicesParams, CreateServiceRequest } from '../types/api';

interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: (params?: SearchServicesParams) => Promise<void>;
  fetchServiceById: (id: string) => Promise<Service>;
  createService: (data: CreateServiceRequest) => Promise<Service>;
  updateService: (id: string, data: Partial<CreateServiceRequest>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<Service>;
}

export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async (params?: SearchServicesParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceService.searchServices(params);
      setServices(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceById = async (id: string): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const service = await serviceService.getServiceById(id);
      return service;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (data: CreateServiceRequest): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const service = await serviceService.createService(data);
      setServices(prev => [service, ...prev]);
      return service;
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, data: Partial<CreateServiceRequest>): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const service = await serviceService.updateService(id, data);
      setServices(prev => prev.map(s => s._id === id ? service : s));
      return service;
    } catch (err: any) {
      setError(err.message || 'Failed to update service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await serviceService.deleteService(id);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (id: string): Promise<Service> => {
    try {
      setLoading(true);
      setError(null);
      const service = await serviceService.toggleServiceStatus(id);
      setServices(prev => prev.map(s => s._id === id ? service : s));
      return service;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle service status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
  };
};
```

#### useSearch Hook (`hooks/useSearch.ts`)

```typescript
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { serviceService } from '../services/service.service';
import { Service } from '../types/models';
import { SearchServicesParams } from '../types/api';

interface UseSearchReturn {
  results: Service[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: SearchServicesParams;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: SearchServicesParams) => void;
  clearFilters: () => void;
  search: () => Promise<void>;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQueryState] = useState('');
  const [filters, setFiltersState] = useState<SearchServicesParams>({});

  const performSearch = async (query: string, searchFilters: SearchServicesParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await serviceService.searchServices({
        query,
        ...searchFilters,
      });
      setResults(response.data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string, searchFilters: SearchServicesParams) => {
      performSearch(query, searchFilters);
    }, 500),
    []
  );

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    debouncedSearch(query, filters);
  };

  const setFilters = (newFilters: SearchServicesParams) => {
    setFiltersState(newFilters);
    performSearch(searchQuery, newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
    performSearch(searchQuery, {});
  };

  const search = async () => {
    await performSearch(searchQuery, filters);
  };

  return {
    results,
    loading,
    error,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    clearFilters,
    search,
  };
};
```


### Navigation Architecture

#### Root Navigator (`navigation/AppNavigator.tsx`)

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ArtisanNavigator } from './ArtisanNavigator';
import { RootStackParamList } from '../types/navigation';
import { linking } from './linking';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user?.role === 'customer' ? (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        ) : (
          <Stack.Screen name="Artisan" component={ArtisanNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

#### Customer Navigator (`navigation/CustomerNavigator.tsx`)

```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { CustomerTabParamList, CustomerStackParamList } from '../types/navigation';

// Screens
import HomeScreen from '../screens/customer/HomeScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import BookingsScreen from '../screens/customer/BookingsScreen';
import RequestsScreen from '../screens/customer/RequestsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ServiceDetailsScreen from '../screens/shared/ServiceDetailsScreen';
import ServiceRequestScreen from '../screens/customer/ServiceRequestScreen';
import BookingDetailsScreen from '../screens/shared/BookingDetailsScreen';
import RequestDetailsScreen from '../screens/shared/RequestDetailsScreen';
import ArtisanProfileScreen from '../screens/shared/ArtisanProfileScreen';
import CreateBookingScreen from '../screens/customer/CreateBookingScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import HelpScreen from '../screens/profile/HelpScreen';

const Tab = createBottomTabNavigator<CustomerTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

const CustomerTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Bookings':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Requests':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="CustomerTabs" 
        component={CustomerTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ServiceDetails" 
        component={ServiceDetailsScreen}
        options={{ title: 'Service Details' }}
      />
      <Stack.Screen 
        name="ServiceRequest" 
        component={ServiceRequestScreen}
        options={{ title: 'Request Service' }}
      />
      <Stack.Screen 
        name="BookingDetails" 
        component={BookingDetailsScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen 
        name="RequestDetails" 
        component={RequestDetailsScreen}
        options={{ title: 'Request Details' }}
      />
      <Stack.Screen 
        name="ArtisanProfile" 
        component={ArtisanProfileScreen}
        options={{ title: 'Artisan Profile' }}
      />
      <Stack.Screen 
        name="CreateBooking" 
        component={CreateBookingScreen}
        options={{ title: 'Create Booking' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen}
        options={{ title: 'Change Password' }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ title: 'Help & Support' }}
      />
    </Stack.Navigator>
  );
};
```

#### Deep Linking Configuration (`navigation/linking.ts`)

```typescript
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['bizbridge://', 'https://bizbridge.ng'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          RegisterCustomer: 'register/customer',
          RegisterArtisan: 'register/artisan',
        },
      },
      Customer: {
        screens: {
          CustomerTabs: {
            screens: {
              Home: 'home',
              Search: 'search',
              Bookings: 'bookings',
              Requests: 'requests',
              Profile: 'profile',
            },
          },
          ServiceDetails: 'services/:serviceId',
          ArtisanProfile: 'artisans/:artisanId',
          BookingDetails: 'bookings/:bookingId',
          RequestDetails: 'requests/:requestId',
        },
      },
      Artisan: {
        screens: {
          ArtisanTabs: {
            screens: {
              Home: 'home',
              MyWork: 'my-work',
              RequestInbox: 'inbox',
              MyServices: 'my-services',
              Profile: 'profile',
            },
          },
          ServiceDetails: 'services/:serviceId',
          BookingDetails: 'bookings/:bookingId',
          RequestDetails: 'requests/:requestId',
        },
      },
    },
  },
};
```

### API Integration Layer

#### Axios Configuration (`services/api.ts`)

```typescript
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/api';

const TOKEN_KEY = '@bizbridge_token';

class ApiClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number>;

  constructor() {
    this.retryCount = new Map();
    
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors and retries
    this.client.interceptors.response.use(
      (response) => {
        // Clear retry count on success
        const requestKey = this.getRequestKey(response.config);
        this.retryCount.delete(requestKey);
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig;
        
        // Handle 401 - Unauthorized
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
          return Promise.reject(error);
        }

        // Retry logic for 5xx errors and network errors
        if (this.shouldRetry(error)) {
          const requestKey = this.getRequestKey(config);
          const currentRetry = this.retryCount.get(requestKey) || 0;

          if (currentRetry < API_CONFIG.RETRY_ATTEMPTS) {
            this.retryCount.set(requestKey, currentRetry + 1);
            
            // Exponential backoff
            const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, currentRetry);
            await this.sleep(delay);
            
            return this.client.request(config);
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    if (!error.response) return true;
    const status = error.response.status;
    return status >= 500 && status < 600;
  }

  private getRequestKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}`;
  }

  private async handleUnauthorized() {
    // Clear stored auth and trigger logout
    await AsyncStorage.multiRemove([TOKEN_KEY, '@bizbridge_user']);
    // Navigation to login will be handled by auth context
  }

  private normalizeError(error: AxiosError): Error {
    if (error.response?.data) {
      const data = error.response.data as any;
      return new Error(data.message || 'An error occurred');
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Network error');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getInstance();
```

#### Auth Service (`services/auth.service.ts`)

```typescript
import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterCustomerRequest, 
  RegisterArtisanRequest,
  ApiResponse 
} from '../types/api';
import { User } from '../types/models';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data.data;
  }

  async registerCustomer(data: RegisterCustomerRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.REGISTER_CUSTOMER,
      data
    );
    return response.data.data;
  }

  async registerArtisan(data: RegisterArtisanRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.REGISTER_ARTISAN,
      data
    );
    return response.data.data;
  }

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.ME);
    return response.data.data;
  }
}

export const authService = new AuthService();
```

#### Service Service (`services/service.service.ts`)

```typescript
import { api } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { 
  SearchServicesParams, 
  CreateServiceRequest,
  PaginatedResponse,
  ApiResponse 
} from '../types/api';
import { Service } from '../types/models';

class ServiceService {
  async searchServices(params?: SearchServicesParams): Promise<PaginatedResponse<Service>> {
    const response = await api.get<PaginatedResponse<Service>>(
      API_ENDPOINTS.SERVICES_SEARCH,
      { params }
    );
    return response.data;
  }

  async getFeaturedServices(): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>(
      API_ENDPOINTS.SERVICES_FEATURED
    );
    return response.data.data;
  }

  async getServiceById(id: string): Promise<Service> {
    const response = await api.get<ApiResponse<Service>>(
      `${API_ENDPOINTS.SERVICES}/${id}`
    );
    return response.data.data;
  }

  async getMyServices(): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>(
      API_ENDPOINTS.MY_SERVICES
    );
    return response.data.data;
  }

  async createService(data: CreateServiceRequest): Promise<Service> {
    const response = await api.post<ApiResponse<Service>>(
      API_ENDPOINTS.SERVICES,
      data
    );
    return response.data.data;
  }

  async updateService(id: string, data: Partial<CreateServiceRequest>): Promise<Service> {
    const response = await api.put<ApiResponse<Service>>(
      `${API_ENDPOINTS.SERVICES}/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteService(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.SERVICES}/${id}`);
  }

  async toggleServiceStatus(id: string): Promise<Service> {
    const response = await api.put<ApiResponse<Service>>(
      `${API_ENDPOINTS.SERVICES}/${id}/toggle-status`
    );
    return response.data.data;
  }
}

export const serviceService = new ServiceService();
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following testable properties. During reflection, I found these redundancies:

- Properties 2.6, 29.1 are identical (token storage after login) - consolidated into Property 1
- Properties 2.10, 29.7 are similar (logout clears storage) - consolidated into Property 2
- Properties 3.3 and 3.4 both test theme persistence - combined into Property 3
- Property 29.4 is covered by Property 4 (auth state initialization)

### Property 1: Authentication Token Persistence

*For any* successful authentication (login or registration), the JWT token returned by the server should be stored in AsyncStorage and retrievable on subsequent reads.

**Validates: Requirements 2.6, 29.1**

### Property 2: Logout Clears Authentication State

*For any* authenticated user session, when logout is performed, all authentication data (token and user info) should be removed from AsyncStorage, and the storage should not contain these keys afterward.

**Validates: Requirements 2.10, 29.7**

### Property 3: Theme Preference Persistence

*For any* theme selection (light or dark), when the user changes the theme, the preference should be stored in AsyncStorage and should be the active theme when the app is restarted.

**Validates: Requirements 3.3, 3.4**

### Property 4: Authentication State Initialization

*For any* app launch, if a valid auth token exists in AsyncStorage, the app should initialize in an authenticated state and navigate to the appropriate dashboard based on user role.

**Validates: Requirements 29.4**

### Property 5: Authenticated Request Authorization

*For any* API request made while authenticated, the request headers should include the Authorization header with the Bearer token from AsyncStorage.

**Validates: Requirements 2.8**

### Property 6: Invalid Token Redirect

*For any* API request that returns a 401 Unauthorized status, the app should clear authentication state and redirect to the login screen.

**Validates: Requirements 2.9**

### Property 7: Email Validation

*For any* string input, the email validation function should return true only for strings matching the standard email format (local@domain.tld) and false otherwise.

**Validates: Requirements 34.1**

### Property 8: Password Length Validation

*For any* string input, the password validation function should return true only for strings with 6 or more characters and false for shorter strings.

**Validates: Requirements 34.2**

### Property 9: Phone Number Validation

*For any* string input, the Nigerian phone number validation function should return true only for strings matching valid Nigerian phone formats (+234XXXXXXXXXX or 0XXXXXXXXXXX) and false otherwise.

**Validates: Requirements 34.3**

### Property 10: Required Field Validation

*For any* form with required fields, the form submission should be prevented (validation returns false) when any required field is empty or contains only whitespace.

**Validates: Requirements 34.4**

### Property 11: Search Input Debouncing

*For any* sequence of rapid search input changes (within 500ms), the number of API calls made should be significantly less than the number of input change events, with only the final input value triggering an API call after the debounce delay.

**Validates: Requirements 51.3**

### Property 12: HTTPS Protocol Enforcement

*For any* API request URL constructed by the app, the URL should use the HTTPS protocol (start with "https://") in production mode.

**Validates: Requirements 52.3**

### Property 13: Input Whitespace Trimming

*For any* text input submitted through a form, the submitted value should have no leading or trailing whitespace characters.

**Validates: Requirements 73.1**

### Property 14: HTML Tag Sanitization

*For any* user-generated text content containing HTML tags, the sanitized output should not contain any HTML tag characters (< > / and tag names).

**Validates: Requirements 73.2**

### Property 15: Image Upload Size Validation

*For any* file selected for image upload, if the file size exceeds 5MB (5,242,880 bytes), the validation should reject the file and prevent upload.

**Validates: Requirements 73.5**

### Property 16: API Request Data Structure

*For any* customer registration, the POST request to `/api/auth/register/customer` should include all required fields: fullName, email, password, and location object with lga property.

**Validates: Requirements 2.4**

### Property 17: Artisan Registration Data Structure

*For any* artisan registration, the POST request to `/api/auth/register/artisan` should include all required fields: contactName, businessName, email, password, phoneNumber, and location object with lga property.

**Validates: Requirements 2.5**

### Property 18: Role-Based Navigation

*For any* successful authentication, the app should navigate to the customer dashboard if user role is "customer" and to the artisan dashboard if user role is "artisan".

**Validates: Requirements 2.7**

### Property 19: Login API Integration

*For any* login attempt with credentials, the app should send a POST request to `/api/auth/login` with email and password in the request body.

**Validates: Requirements 2.3**


## Error Handling

### Error Handling Strategy

The application implements a comprehensive error handling strategy across all layers:

#### API Layer Error Handling

1. **Network Errors**: Detected when no response is received
   - Display user-friendly message: "Unable to connect. Please check your internet connection."
   - Provide retry button
   - Automatic retry with exponential backoff (up to 3 attempts)

2. **HTTP Status Errors**:
   - **401 Unauthorized**: Clear auth state, redirect to login
   - **403 Forbidden**: Display "Access denied" message
   - **404 Not Found**: Display "Resource not found" message
   - **500 Server Error**: Display "Server error. Please try again later." with retry option
   - **Other 4xx**: Display error message from API response

3. **Timeout Errors**: 30-second timeout for all requests
   - Display "Request timed out" message
   - Provide retry button

4. **Validation Errors**: API returns validation errors
   - Display field-specific error messages below inputs
   - Highlight invalid fields in red

#### Form Validation Error Handling

1. **Client-Side Validation**: Validate before submission
   - Email format validation
   - Password length validation
   - Phone number format validation
   - Required field validation
   - Display inline error messages

2. **Server-Side Validation**: Handle API validation errors
   - Map server errors to form fields
   - Display error messages below respective fields

#### Storage Error Handling

1. **AsyncStorage Errors**: Handle storage failures gracefully
   - Log errors to console
   - Continue app operation without crashing
   - Fall back to default values when read fails

#### Image Upload Error Handling

1. **File Size Validation**: Check before upload
   - Display error if file exceeds 5MB
   - Suggest image compression

2. **Upload Failures**: Handle network errors during upload
   - Display upload progress
   - Show error message on failure
   - Provide retry option

#### Navigation Error Handling

1. **Deep Link Errors**: Handle invalid deep links
   - Display "Invalid link" message
   - Navigate to home screen

2. **Missing Parameters**: Handle navigation with missing params
   - Log error
   - Navigate back or to safe screen

### Error Display Components

#### ErrorMessage Component

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  style 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text style={[styles.message, { color: theme.colors.error }]}>
        {message}
      </Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} variant="outline" />
      )}
    </View>
  );
};
```

#### Error Boundary

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button 
            title="Restart App" 
            onPress={() => this.setState({ hasError: false, error: null })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Offline Handling

```typescript
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};

// Offline Banner Component
export const OfflineBanner: React.FC = () => {
  const isOnline = useNetworkStatus();
  const { theme } = useTheme();

  if (isOnline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.colors.error }]}>
      <Ionicons name="cloud-offline-outline" size={20} color="#FFF" />
      <Text style={styles.bannerText}>No internet connection</Text>
    </View>
  );
};
```

## Testing Strategy

### Dual Testing Approach

The BizBridge mobile application requires both unit testing and property-based testing to ensure comprehensive coverage and correctness.

#### Unit Testing

Unit tests focus on specific examples, edge cases, and integration points:

**Scope**:
- Component rendering and UI interactions
- Specific user flows (login, registration, service creation)
- Edge cases (empty states, error states, boundary values)
- Integration between components and hooks
- Navigation flows
- AsyncStorage operations

**Tools**:
- Jest for test runner
- React Native Testing Library for component testing
- Mock Service Worker (MSW) for API mocking

**Example Unit Tests**:
```typescript
describe('LoginScreen', () => {
  it('should display email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />);
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  it('should show error for invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
    fireEvent.press(getByText('Login'));
    
    expect(await findByText('Invalid email format')).toBeTruthy();
  });

  it('should navigate to dashboard on successful login', async () => {
    // Test implementation
  });
});
```

#### Property-Based Testing

Property tests verify universal properties across all inputs using randomized test data:

**Scope**:
- Authentication token persistence
- Input validation functions
- Data transformation functions
- API request structure
- Storage operations
- Sanitization functions

**Tools**:
- fast-check for property-based testing in JavaScript/TypeScript

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: mobile-app-expo-typescript, Property {N}: {description}`

**Example Property Tests**:
```typescript
import fc from 'fast-check';

describe('Property Tests - Authentication', () => {
  /**
   * Feature: mobile-app-expo-typescript, Property 1: Authentication Token Persistence
   * For any successful authentication, the JWT token should be stored and retrievable
   */
  it('should persist auth token for any successful authentication', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6 }),
        }),
        async (credentials) => {
          // Mock successful auth response
          const mockToken = fc.sample(fc.string({ minLength: 20 }), 1)[0];
          mockAuthService.login.mockResolvedValue({ 
            token: mockToken, 
            user: mockUser 
          });

          // Perform login
          await authHook.login(credentials);

          // Verify token is stored
          const storedToken = await AsyncStorage.getItem('@bizbridge_token');
          expect(storedToken).toBe(mockToken);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: mobile-app-expo-typescript, Property 2: Logout Clears Authentication State
   * For any authenticated session, logout should clear all auth data
   */
  it('should clear all auth data on logout', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          token: fc.string({ minLength: 20 }),
          user: fc.record({
            _id: fc.uuid(),
            email: fc.emailAddress(),
            role: fc.constantFrom('customer', 'artisan'),
          }),
        }),
        async ({ token, user }) => {
          // Setup: Store auth data
          await AsyncStorage.setItem('@bizbridge_token', token);
          await AsyncStorage.setItem('@bizbridge_user', JSON.stringify(user));

          // Perform logout
          await authHook.logout();

          // Verify storage is cleared
          const storedToken = await AsyncStorage.getItem('@bizbridge_token');
          const storedUser = await AsyncStorage.getItem('@bizbridge_user');
          
          expect(storedToken).toBeNull();
          expect(storedUser).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property Tests - Validation', () => {
  /**
   * Feature: mobile-app-expo-typescript, Property 7: Email Validation
   * For any string, email validation should correctly identify valid emails
   */
  it('should validate email format correctly', () => {
    fc.assert(
      fc.property(fc.emailAddress(), (email) => {
        expect(validateEmail(email)).toBe(true);
      }),
      { numRuns: 100 }
    );

    fc.assert(
      fc.property(
        fc.string().filter(s => !s.includes('@') || !s.includes('.')),
        (invalidEmail) => {
          expect(validateEmail(invalidEmail)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: mobile-app-expo-typescript, Property 8: Password Length Validation
   * For any string, password validation should enforce minimum length
   */
  it('should validate password length', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 6 }),
        (password) => {
          expect(validatePassword(password)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );

    fc.assert(
      fc.property(
        fc.string({ maxLength: 5 }),
        (shortPassword) => {
          expect(validatePassword(shortPassword)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: mobile-app-expo-typescript, Property 13: Input Whitespace Trimming
   * For any text input, submitted value should have no leading/trailing whitespace
   */
  it('should trim whitespace from all inputs', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.nat({ max: 10 }),
        fc.nat({ max: 10 }),
        (text, leadingSpaces, trailingSpaces) => {
          const input = ' '.repeat(leadingSpaces) + text + ' '.repeat(trailingSpaces);
          const trimmed = trimInput(input);
          
          expect(trimmed).toBe(text);
          expect(trimmed.startsWith(' ')).toBe(false);
          expect(trimmed.endsWith(' ')).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 70% code coverage
- **Property Test Coverage**: All 19 correctness properties implemented
- **Integration Test Coverage**: All critical user flows tested
- **E2E Test Coverage**: Main user journeys (login, service search, booking creation)

### Testing Best Practices

1. **Isolation**: Mock external dependencies (API, AsyncStorage)
2. **Determinism**: Use fixed seeds for random data in development
3. **Fast Execution**: Keep unit tests under 5 seconds total
4. **Clear Assertions**: One logical assertion per test
5. **Descriptive Names**: Test names describe the scenario and expected outcome
6. **Arrange-Act-Assert**: Follow AAA pattern consistently


## Implementation Guidelines

### Development Workflow

#### Phase 1: Core Setup (Week 1)
1. Initialize Expo TypeScript project
2. Set up project structure (constants, types, theme, etc.)
3. Configure TypeScript strict mode
4. Implement theme system with light/dark modes
5. Create base components (Button, Card, Input, etc.)
6. Set up navigation structure
7. Configure Axios with interceptors

#### Phase 2: Authentication (Week 1-2)
1. Implement auth screens (Login, Register)
2. Create useAuth hook
3. Implement auth service
4. Add AsyncStorage integration
5. Test authentication flow
6. Implement onboarding screens

#### Phase 3: Customer Features (Week 2-3)
1. Home screen with featured services
2. Search and filter functionality
3. Service details screen
4. Service request creation
5. Customer dashboard
6. Bookings management
7. Request history

#### Phase 4: Artisan Features (Week 3-4)
1. Artisan dashboard
2. Service management (CRUD)
3. Request inbox
4. Work management
5. Service request responses

#### Phase 5: Shared Features (Week 4-5)
1. Booking details and messaging
2. Profile management
3. Review system
4. Image upload
5. Artisan profile view

#### Phase 6: Polish & Testing (Week 5-6)
1. Error handling refinement
2. Loading states and animations
3. Empty states with illustrations
4. Accessibility improvements
5. Performance optimization
6. Unit and property tests
7. E2E testing

### Code Quality Standards

#### TypeScript Guidelines

1. **Strict Mode**: Enable all strict type checking options
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

2. **Type Definitions**: Define explicit types for all functions
```typescript
// Good
const fetchUser = async (id: string): Promise<User> => {
  // implementation
};

// Avoid
const fetchUser = async (id) => {
  // implementation
};
```

3. **Interface over Type**: Prefer interfaces for object shapes
```typescript
// Good
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}

// Acceptable for unions
type Status = 'pending' | 'active' | 'completed';
```

#### Component Guidelines

1. **Functional Components**: Use functional components with hooks
```typescript
export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  const { theme } = useTheme();
  // implementation
};
```

2. **Props Interface**: Define props interface for every component
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}
```

3. **Memoization**: Use React.memo for expensive components
```typescript
export const ServiceList = React.memo<ServiceListProps>(({ services }) => {
  // implementation
});
```

#### Hook Guidelines

1. **Custom Hooks**: Extract reusable logic into custom hooks
```typescript
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

2. **Hook Return Types**: Explicitly type hook returns
```typescript
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  // implementation
};
```

#### Styling Guidelines

1. **Theme-Based Styling**: Always use theme values
```typescript
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});
```

2. **Responsive Sizing**: Use relative units where appropriate
```typescript
const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
```

3. **Platform-Specific Styles**: Use Platform.select when needed
```typescript
const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```

### Performance Optimization

#### Image Optimization

1. **Lazy Loading**: Use expo-image for automatic optimization
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>
```

2. **Image Compression**: Compress before upload
```typescript
const compressImage = async (uri: string): Promise<string> => {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipResult.uri;
};
```

#### List Optimization

1. **FlatList**: Use FlatList for long lists
```typescript
<FlatList
  data={services}
  renderItem={({ item }) => <ServiceCard service={item} />}
  keyExtractor={(item) => item._id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

2. **Memoized Render Items**: Prevent unnecessary re-renders
```typescript
const renderItem = useCallback(({ item }: { item: Service }) => (
  <ServiceCard service={item} onPress={() => navigate('ServiceDetails', { serviceId: item._id })} />
), [navigate]);
```

#### State Management Optimization

1. **Context Splitting**: Split contexts by concern
```typescript
// Separate auth and theme contexts
<AuthProvider>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</AuthProvider>
```

2. **Selective Re-renders**: Use context selectors
```typescript
const user = useContext(AuthContext).user;
// Only re-renders when user changes, not on loading/error changes
```

### Accessibility Guidelines

1. **Accessibility Labels**: Provide labels for all interactive elements
```typescript
<TouchableOpacity
  accessibilityLabel="Add to favorites"
  accessibilityHint="Double tap to add this service to your favorites"
  accessibilityRole="button"
>
  <Ionicons name="heart-outline" size={24} />
</TouchableOpacity>
```

2. **Minimum Touch Targets**: Ensure 44x44 minimum size
```typescript
const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

3. **Color Contrast**: Ensure WCAG AA compliance
```typescript
// Use theme colors that meet contrast requirements
const lightThemeColors = {
  text: '#212121', // Contrast ratio 16:1 on white
  textSecondary: '#616161', // Contrast ratio 7:1 on white
};
```

4. **Screen Reader Support**: Test with TalkBack/VoiceOver
```typescript
<View accessible={true} accessibilityLabel="Service card">
  <Text accessibilityRole="header">{service.title}</Text>
  <Text>{service.description}</Text>
</View>
```

### Security Best Practices

1. **Token Storage**: Use secure storage for sensitive data
```typescript
// AsyncStorage is encrypted on iOS, use additional encryption on Android if needed
import * as SecureStore from 'expo-secure-store';

const storeToken = async (token: string) => {
  await SecureStore.setItemAsync('auth_token', token);
};
```

2. **Input Sanitization**: Always sanitize user input
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, ''); // Remove angle brackets
};
```

3. **API Security**: Never log sensitive data
```typescript
// Bad
console.log('Login response:', response);

// Good
console.log('Login successful for user:', response.user.email);
```

### Deployment Considerations

#### Environment Configuration

```typescript
// app.config.ts
export default {
  expo: {
    name: 'BizBridge',
    slug: 'bizbridge',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#DC143C',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bizbridge.app',
      buildNumber: '1.0.0',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#DC143C',
      },
      package: 'com.bizbridge.app',
      versionCode: 1,
    },
    extra: {
      apiUrl: process.env.API_URL || 'https://api.bizbridge.ng',
    },
  },
};
```

#### Build Configuration

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  }
}
```

## Conclusion

This design document provides a comprehensive technical blueprint for the BizBridge mobile application. The architecture emphasizes:

1. **Type Safety**: Strict TypeScript throughout ensures compile-time error detection
2. **Modularity**: Clear separation of concerns with reusable components and hooks
3. **Maintainability**: Well-organized project structure and consistent patterns
4. **Performance**: Optimization techniques for smooth user experience
5. **Accessibility**: WCAG AA compliance for inclusive design
6. **Testability**: Dual testing approach with unit and property-based tests
7. **Security**: Best practices for data protection and input validation

The implementation follows a phased approach, starting with core infrastructure and progressively adding features. The design ensures feature parity with the web application while delivering a superior mobile experience through touch-optimized interactions, modern UI patterns, and mobile-specific optimizations.

All 19 correctness properties defined in this document must be implemented as property-based tests to ensure the application behaves correctly across all possible inputs and states. Combined with comprehensive unit tests, this testing strategy provides confidence in the application's reliability and correctness.

