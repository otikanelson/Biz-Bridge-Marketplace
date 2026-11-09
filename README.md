# BizBridge 🎨

> Connecting skilled Nigerian artisans with quality-conscious customers through a modern digital marketplace.

## 🌟 Overview

BizBridge is a comprehensive marketplace platform that bridges the gap between talented Nigerian artisans and customers seeking authentic, handcrafted products and services. The platform empowers local craftspeople to showcase their skills while providing customers with easy access to unique, high-quality artisanal services.

### ✨ Key Features

- 🎯 **Multi-Role Platform**: Separate interfaces for customers, artisans, and administrators
- 🔍 **Advanced Search**: Find services by category, location, price, and more
- 📱 **Responsive Design**: Seamless experience across desktop and mobile devices
- 📅 **Booking System**: Streamlined service booking with date/time selection
- 🎨 **26+ Craft Categories**: From woodworking to traditional textile arts
- 📍 **Lagos-Focused**: Detailed LGA and locality mapping for precise service location
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control

## 🛠 Tech Stack

### Frontend
- React 18+ | Vite | TailwindCSS | React Router | Axios

### Backend
- Node.js | Express.js | MongoDB | Mongoose | JWT | Multer | Bcrypt

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (v5+)
- Git, npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/otikanelson/Biz-Bridge-Marketplace.git
cd Biz-Bridge-Marketplace

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Environment Setup

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bizbridge
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5174
MAX_FILE_SIZE=5000000
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
VITE_ENABLE_LOGGING=true
```

### 3. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit http://localhost:5174

## 📁 Project Structure

```
Biz-Bridge-Marketplace/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── uploads/       # File storage
├── frontend/          # React/Vite app
│   ├── src/
│   │   ├── api/       # API services
│   │   ├── components/
│   │   ├── config/    # Centralized configs
│   │   ├── context/
│   │   └── utils/
├── docs/              # Documentation
└── README.md
```

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Development server with nodemon
npm start            # Production server
npm run seed         # Seed database
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

## 🎯 API Overview

### Authentication
- `POST /api/auth/register/customer` - Register customer
- `POST /api/auth/register/artisan` - Register artisan
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create service (artisan)
- `GET /api/services/:id` - Get service details
- `PUT /api/services/:id` - Update service (artisan)
- `DELETE /api/services/:id` - Delete service (artisan)

### Users
- `GET /api/users/featured` - Get featured artisans
- `GET /api/users/:userId` - Get user profile

See [docs/Documentation.md](docs/Documentation.md) for complete API reference.

## 🚀 Deployment

See [docs/Deployment-Guide.md](docs/Deployment-Guide.md) for detailed deployment instructions.

**Live Sites:**
- Frontend: https://biz-bridge-marketplace.vercel.app
- Backend: https://biz-bridge-marketplacebackend.vercel.app

## 📚 Documentation

- **[Deployment Guide](docs/Deployment-Guide.md)** - Deploy to production
- **[File Structure](docs/File-Structure.md)** - Project organization
- **[API Documentation](docs/Documentation.md)** - Complete API reference
- **[Feature Roadmap](docs/Feature-Plan.md)** - Planned features

## 🎨 User Roles

### 👤 Customer
Browse services, book artisans, manage bookings, save favorites

### 🎨 Artisan
Create services, manage bookings, update profile, upload portfolio

### 👑 Admin
Manage featured artisans, view analytics, moderate content

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/otikanelson/Biz-Bridge-Marketplace/issues)
- **Email**: support@bizbridge.com

---

**Made with ❤️ for Nigerian artisans** 🇳🇬
