# BizBridge 🎨

> Connecting skilled Nigerian artisans with quality-conscious customers through a modern digital marketplace.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🌟 Overview

BizBridge is a comprehensive marketplace platform that bridges the gap between talented Nigerian artisans and customers seeking authentic, handcrafted products and services. The platform empowers local craftspeople to showcase their skills while providing customers with easy access to unique, high-quality artisanal services.

### ✨ Key Features

- 🎯 **Multi-Role Platform**: Separate interfaces for customers, artisans, and administrators
- 🔍 **Advanced Search**: Find services by category, location, price, and more
- 📱 **Responsive Design**: Seamless experience across desktop and mobile devices
- 🏆 **Featured Artisans**: Admin-curated showcase of premium service providers
- 📅 **Booking System**: Streamlined service booking with date/time selection
- 🎨 **26+ Craft Categories**: From woodworking to traditional textile arts
- 📍 **Lagos-Focused**: Detailed LGA and locality mapping for precise service location
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control

## 🚀 Live Demo

- **Frontend**: [https://bizbridge-demo.vercel.app](https://bizbridge-demo.vercel.app) *(Demo link)*
- **API Documentation**: [https://api.bizbridge.com/docs](https://api.bizbridge.com/docs) *(Demo link)*

### Demo Accounts
```
Customer Account:
Email: customer@demo.com
Password: demo123

Artisan Account:
Email: artisan@demo.com
Password: demo123

Admin Account:
Email: admin@demo.com
Password: admin123
```

## 🛠 Tech Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Performant forms with easy validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Bcrypt** - Password hashing

### Tools & DevOps
- **ESLint & Prettier** - Code linting and formatting
- **Git** - Version control
- **PM2** - Process manager for Node.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (v5 or higher)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bizbridge.git
cd bizbridge
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

**Backend (.env):**
```env
# Database
MONGO_URI=mongodb://localhost:27017/bizbridge

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads
```

**Frontend (.env):**
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=BizBridge
VITE_APP_VERSION=1.0.0
```

### 4. Database Setup

**Start MongoDB:**
```bash
# If using local MongoDB
mongod --dbpath /path/to/your/db

# Or if using MongoDB as a service
sudo systemctl start mongod
```

**Seed the Database (Optional):**
```bash
cd backend
npm run seed
```

### 5. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
bizbridge/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── uploads/             # Uploaded files storage
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/                # Frontend application
│   ├── src/
│   │   ├── api/             # API service functions
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets
│   ├── public/              # Public assets
│   ├── .env                 # Environment variables
│   ├── index.html           # Main HTML file
│   ├── vite.config.js       # Vite configuration
│   └── package.json
├── docs/                    # Documentation
├── README.md
└── LICENSE
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run tests
npm run lint         # Lint code
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

## 🎯 API Documentation

### Authentication Endpoints
```
POST /api/auth/register/customer    # Register as customer
POST /api/auth/register/artisan     # Register as artisan
POST /api/auth/login                # Login user
GET  /api/auth/me                   # Get current user
```

### Service Endpoints
```
GET    /api/services                # Get all services
POST   /api/services                # Create service (artisan only)
GET    /api/services/:id            # Get service by ID
PUT    /api/services/:id            # Update service (artisan only)
DELETE /api/services/:id            # Delete service (artisan only)
GET    /api/services/my-services    # Get artisan's services
GET    /api/services/featured       # Get featured services
```

### User Endpoints
```
GET /api/users/featured             # Get featured artisans (public)
GET /api/users/:userId              # Get user profile by ID
```

### Admin Endpoints (Admin Only)
```
GET    /api/admin/stats             # Get admin dashboard stats
GET    /api/admin/artisans          # Get all artisans for management
PATCH  /api/admin/artisans/:id/feature  # Toggle artisan featured status
```

For detailed API documentation with request/response examples, visit our [API Docs](https://api.bizbridge.com/docs) *(when deployed)*.

## 🎨 User Roles & Permissions

### 👤 Customer
- Browse and search services
- View artisan profiles
- Book services
- Manage booking history
- Save favorite artisans

### 🎨 Artisan
- Create and manage services
- View and manage bookings
- Update business profile
- Upload portfolio images
- Track service performance

### 👑 Admin
- Manage featured artisans
- View platform analytics
- Moderate content
- Manage user accounts
- Configure platform settings

## 🌍 Deployment

### Using PM2 (Production)

**Backend:**
```bash
cd backend
npm install --production
pm2 start server.js --name bizbridge-api
pm2 save
pm2 startup
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist folder using nginx, apache, or any static server
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment Variables for Production

Ensure these environment variables are set in production:

```env
NODE_ENV=production
MONGO_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-production-secret
FRONTEND_URL=https://your-domain.com
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database integration testing
- **E2E Tests**: Complete user workflow testing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Code Style

We use ESLint and Prettier for code formatting:
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run format        # Format code with Prettier
```

## 🐛 Known Issues

- [ ] Image upload occasionally fails on slow connections
- [ ] Search filters need debouncing for better performance
- [ ] Mobile navigation could be improved
- [ ] Need to add image compression for uploads

See our [Issues page](https://github.com/yourusername/bizbridge/issues) for the complete list.

## 📋 Roadmap

### Version 1.1 (Next Release)
- [ ] Real-time messaging between customers and artisans
- [ ] Advanced image gallery for artisan portfolios
- [ ] Email notification system
- [ ] Mobile app development (React Native)

### Version 1.2 (Future)
- [ ] Payment integration (Paystack/Flutterwave)
- [ ] Review and rating system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Yoruba, Igbo, Hausa)

### Version 2.0 (Long-term)
- [ ] Expansion to other Nigerian cities
- [ ] Artisan certification program
- [ ] Marketplace for physical products
- [ ] International shipping capabilities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development**: [Your Name](https://github.com/yourusername)
- **Backend Development**: [Your Name](https://github.com/yourusername)
- **UI/UX Design**: [Your Name](https://github.com/yourusername)

## 📞 Support

- **Email**: support@bizbridge.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/bizbridge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bizbridge/discussions)

## 🙏 Acknowledgments

- Thanks to all Nigerian artisans who inspired this project
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility framework
- [React](https://reactjs.org/) team for the excellent documentation
- [MongoDB](https://mongodb.com/) for the flexible database solution

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/bizbridge?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/bizbridge?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/bizbridge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/bizbridge)

---

**Made with ❤️ for Nigerian artisans**

*Empowering local craftsmanship through technology* 🇳🇬
