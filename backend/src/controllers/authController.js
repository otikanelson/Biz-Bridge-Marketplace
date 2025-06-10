// backend/src/controllers/authController.js - FIXED: No Double Hashing
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

// Register User - FIXED: Let schema middleware handle password hashing
export const registerUser = async (req, res) => {
  try {
    console.log('Registration attempt:', { ...req.body, password: '[HIDDEN]' });
    
    const {
      email, username, password, role,
      // Customer fields
      fullName, customerLga,
      // Artisan fields  
      contactName, contactPhone, businessName, yearEstablished,
      staffStrength, isCAC, contactAddress, lga, websiteURL
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

    // ✅ FIXED: DON'T manually hash password - let schema middleware do it
    // Create user data with plain password
    const userData = {
      email,
      username,
      password, // ✅ Plain password - schema will hash it automatically
      role
    };

    // Add role-specific fields
    if (role === "customer") {
      userData.fullName = fullName;
      
      // LAGOS-ONLY: Always set Lagos as city/state, only collect LGA
      userData.customerLocation = {
        city: 'Lagos',     
        state: 'Lagos',    
        lga: customerLga || null  
      };
      
    } else if (role === "artisan") {
      userData.contactName = contactName;
      userData.phoneNumber = contactPhone;
      userData.businessName = businessName;
      
      // LAGOS-ONLY: Always set Lagos as city/state, only collect LGA
      userData.location = {
        address: contactAddress || null,
        city: 'Lagos',     
        state: 'Lagos',    
        lga: lga || null   
      };
      
      // Business information
      userData.business = {
        yearEstablished: yearEstablished ? parseInt(yearEstablished) : null,
        staffStrength: staffStrength ? parseInt(staffStrength) : null,
        isCACRegistered: isCAC === "Yes",
        websiteURL: websiteURL || null
      };
    }

    // Add profile image if provided
    if (req.file) {
      userData.profileImage = req.file.path;
    }

    // Create user - schema middleware will hash the password automatically
    const user = new User(userData);
    await user.save(); // ✅ Password gets hashed here by schema middleware

    // Generate token
    const token = generateToken(user);

    console.log('✅ User registered successfully:', user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ...(role === 'customer' && { 
          fullName: user.fullName,
          customerLocation: user.customerLocation
        }),
        ...(role === 'artisan' && { 
          contactName: user.contactName,
          businessName: user.businessName,
          location: user.location
        })
      }
    });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login User - CLEANED UP VERSION
export const loginUser = async (req, res) => {
  try {
    console.log('🔑 Login attempt:', req.body.email);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password using schema method (which uses bcrypt.compare)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate token
    const token = generateToken(user);

    console.log('✅ User logged in successfully:', user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ...(user.role === 'customer' && { 
          fullName: user.fullName,
          customerLocation: user.customerLocation
        }),
        ...(user.role === 'artisan' && { 
          contactName: user.contactName,
          businessName: user.businessName,
          location: user.location
        })
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
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
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    console.log('✅ Current user data fetched for:', user.username);
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        ...(user.role === 'customer' && { 
          fullName: user.fullName,
          customerLocation: user.customerLocation 
        }),
        ...(user.role === 'artisan' && { 
          contactName: user.contactName,
          businessName: user.businessName,
          phoneNumber: user.phoneNumber,
          location: user.location,
          business: user.business
        })
      }
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user data"
    });
  }
};