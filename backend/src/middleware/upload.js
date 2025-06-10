// backend/src/middleware/upload.js - COMPLETE FIXED VERSION
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

// ✅ IMAGE FILE FILTER
const imageFilter = (req, file, cb) => {
  console.log('🔍 Filtering image file:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });
  
  // Allow common image formats
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'Type:', file.mimetype);
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
    console.log('✅ Document accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ Document rejected:', file.originalname, 'Type:', file.mimetype);
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

// ✅ CAC DOCUMENT UPLOAD CONFIGURATION (This was missing!)
export const uploadCACDocument = multer({
  storage: cacStorage,
  fileFilter: documentFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for documents
    files: 1
  }
});

// ✅ ENHANCED ERROR HANDLING MIDDLEWARE FOR SERVICE IMAGES
export const handleUploadError = (req, res, next) => {
  const upload = uploadServiceImages.array('images', 5);
  
  upload(req, res, (err) => {
    console.log('📤 Upload middleware processing:', {
      body: Object.keys(req.body),
      files: req.files ? req.files.length : 0,
      error: err ? err.message : 'none'
    });
    
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 5MB for images.'
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
    
    if (err && err.message.includes('Invalid file type')) {
      console.error('❌ File type error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    if (err) {
      console.error('❌ General upload error:', err);
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    }
    
    // Log successful uploads
    if (req.files && req.files.length > 0) {
      console.log(`✅ Uploaded ${req.files.length} files:`, 
        req.files.map(f => f.filename).join(', '));
    }
    
    next();
  });
};

// ✅ GENERAL ERROR HANDLING MIDDLEWARE
export const handleUploadErrorGeneral = (err, req, res, next) => {
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

// ✅ UTILITY FUNCTION - Convert file path to URL (FIXED)
export const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // Convert Windows backslashes to forward slashes
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // Extract just the relative path from uploads directory
  if (normalizedPath.includes('uploads/')) {
    const uploadsIndex = normalizedPath.indexOf('uploads/');
    return '/' + normalizedPath.substring(uploadsIndex);
  }
  
  // If no uploads path found, assume it's already a relative path
  return normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
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