// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role,
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register User
export const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '[HIDDEN]' });
    
    const {
      email, username, password, role,
      // Customer fields
      fullName,
      // Artisan fields  
      contactName, contactPhone, businessName, yearEstablished,
      staffStrength, isCAC, contactAddress, city, lga, websiteURL
    } = req.body;

    // Validation
    if (!email || !username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, username, password, and role are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? "Email already in use" : "Username already taken"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data
    const userData = {
      email,
      username,
      password: hashedPassword,
      role
    };

    // Add role-specific fields
    if (role === "customer") {
      userData.fullName = fullName;
    } else if (role === "artisan") {
      userData.contactName = contactName;
      userData.phoneNumber = contactPhone;
      userData.businessName = businessName;
      userData.yearEstablished = yearEstablished;
      userData.staffStrength = staffStrength;
      userData.isCACRegistered = isCAC === "Yes";
      userData.address = contactAddress;
      userData.city = city;
      userData.localGovernmentArea = lga;
      userData.websiteURL = websiteURL;
    }

    // Add profile image if provided
    if (req.file) {
      userData.profileImage = req.file.path;
    }

    // Create user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user);

    console.log('User registered successfully:', user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ...(role === 'customer' && { fullName: user.fullName }),
        ...(role === 'artisan' && { 
          contactName: user.contactName,
          businessName: user.businessName 
        })
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user);

    console.log('User logged in successfully:', user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ...(user.role === 'customer' && { fullName: user.fullName }),
        ...(user.role === 'artisan' && { 
          contactName: user.contactName,
          businessName: user.businessName 
        })
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data"
    });
  }
};