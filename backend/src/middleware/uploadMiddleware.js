// middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get current file path (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const serviceUploadsDir = path.join(uploadsDir, 'services');

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(serviceUploadsDir)) {
  fs.mkdirSync(serviceUploadsDir, { recursive: true });
}

// Configure storage for service images
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, serviceUploadsDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${uniqueSuffix}${ext}`);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  // Accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload middleware for services
export const uploadServiceImages = multer({
  storage: serviceStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5 // Max 5 files
  }
});

// Handle upload errors
export const handleUploadErrors = (req, res, next) => {
  const upload = uploadServiceImages.array('images', 5);
  
  upload(req, res, (err) => {
    console.log("Upload middleware processing request", req.body);
    
    if (err instanceof multer.MulterError) {
      // Multer error handling
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum is 5 images.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: `File upload error: ${err.message}`
      });
    }
    
    // Log successful uploads
    if (req.files) {
      console.log(`Uploaded ${req.files.length} files:`, 
        req.files.map(f => f.filename).join(', '));
    }
    
    next();
  });
};

// For simplification, export a utility function that can be used directly in routes
export const uploadFiles = (dest, fieldName, maxCount) => {
  const dir = path.join(uploadsDir, dest);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${dest}-${uniqueSuffix}${ext}`);
    }
  });
  
  return multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
      files: maxCount
    }
  }).array(fieldName, maxCount);
};