// Updated authRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  uploadProfileImage,
  uploadCACDocument,
} from "../middleware/upload.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/authController.js";
import User from "../models/user.js";

const router = express.Router();

// Register routes - different handling for customers and artisans
router.post(
  "/register/customer",
  uploadProfileImage.single("profileImage"),
  (req, res, next) => {
    req.body.role = "customer";
    next();
  },
  registerUser
);

router.post(
  "/register/artisan",
  uploadProfileImage.single("profileImage"),
  (req, res, next) => {
    req.body.role = "artisan";
    next();
  },
  registerUser
);

// Upload CAC document for artisans (separate route)
router.post(
  "/upload-cac/:userId",
  protect,
  uploadCACDocument.single("cacDocument"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document uploaded" });
      }

      const user = await User.findById(req.params.userId);
      if (!user || user.role !== "artisan") {
        return res.status(404).json({ message: "Artisan not found" });
      }

      user.CACDocument = req.file.path;
      await user.save();

      res.status(200).json({
        message: "CAC document uploaded successfully",
        documentPath: req.file.path,
      });
    } catch (error) {
      console.error("CAC document upload error:", error);
      res
        .status(500)
        .json({ message: "Error uploading document", error: error.message });
    }
  }
);

// Login route
router.post("/login", loginUser);

// Get current user (protected route)
router.get("/me", protect, getCurrentUser);

export default router;