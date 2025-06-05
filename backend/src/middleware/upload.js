// backend/src/middleware/upload.js - FIXED VERSION
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, '../../uploads'),
    path.join(__dirname, '../../uploads/profiles'),
    path.join(__dirname, '../../uploads/services'),
    path.join(__dirname, '../../uploads/cac')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
};

// Initialize directories
createUploadDirs();

// ✅ PROFILE IMAGE STORAGE
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/profiles');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: profile-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  }
});

// ✅ SERVICE IMAGE STORAGE
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/services');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: service-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${uniqueSuffix}${ext}`);
  }
});

// ✅ CAC DOCUMENT STORAGE
const cacStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/cac');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create unique filename: cac-timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `cac-${uniqueSuffix}${ext}`);
  }
});

// ✅ FILE FILTER - More comprehensive
const imageFilter = (req, file, cb) => {
  console.log('🔍 Filtering file:', file.originalname, 'Type:', file.mimetype);
  
  // Allow common image formats
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`), false);
  }
};

// ✅ DOCUMENT FILTER - For CAC documents
const documentFilter = (req, file, cb) => {
  console.log('📄 Filtering document:', file.originalname, 'Type:', file.mimetype);
  
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid document type. Only images and PDF files are allowed.`), false);
  }
};

// ✅ UPLOAD CONFIGURATIONS
export const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1
  }
});

export const uploadServiceImages = multer({
  storage: serviceStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 5 // Max 5 images
  }
});

export const uploadCACDocument = multer({
  storage: cacStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for documents
    files: 1
  }
});

// ✅ ERROR HANDLING MIDDLEWARE
export const handleUploadError = (err, req, res, next) => {
  console.error('📤 Upload error:', err);
  
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB for images, 10MB for documents.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 5 images per service.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected file field. Please check your form.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
    }
  }
  
  if (err.message.includes('Invalid file type') || err.message.includes('Invalid document type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  // Pass other errors to global error handler
  next(err);
};

// ✅ UTILITY FUNCTION - Convert file path to URL
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // Convert Windows backslashes to forward slashes
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Remove the backend path part and keep only relative path from uploads
  const relativePath = normalizedPath.includes('uploads/') 
    ? normalizedPath.substring(normalizedPath.indexOf('uploads/'))
    : normalizedPath;
  
  return `/${relativePath}`;
};

// ✅ CLEANUP FUNCTION - Remove old files
export const cleanupFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('🗑️ Cleaned up file:', filePath);
    }
  } catch (error) {
    console.error('❌ Error cleaning up file:', error);
  }
};