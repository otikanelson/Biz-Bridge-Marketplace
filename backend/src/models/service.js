// models/service.js - Updated for No-Payment System
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, "Service title is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: [
      'Woodworking', 'Pottery & Ceramics', 'Leathercraft', 'Textile Art',
      'Jewelry Making', 'Metalwork', 'Glass Art', 'Traditional Clothing',
      'Painting & Drawing', 'Sculpture', 'Basket Weaving', 'Beadwork',
      'Paper Crafts', 'Soap & Candle Making', 'Calabash Carving',
      'Musical Instruments', 'Hair Braiding & Styling', 'Furniture Restoration',
      'Shoemaking', 'Sign Writing', 'Tie & Dye', 'Adire Textile',
      'Food Preservation', 'Batik', 'Embroidery', 'Photography', 'Other'
    ],
    index: true
  },

  // ========== NEW: PRICING STRUCTURE ==========
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'negotiate', 'categorized'],
      required: [true, "Pricing type is required"]
    },
    
    // For fixed pricing services
    basePrice: {
      type: Number,
      required: function() {
        return this.pricing.type === 'fixed';
      },
      min: [0, "Price cannot be negative"]
    },
    baseDuration: {
      type: String,
      required: function() {
        return this.pricing.type === 'fixed';
      }
    },
    currency: {
      type: String,
      default: 'NGN',
      enum: ['NGN', 'USD', 'EUR', 'GBP']
    },
    
    // For categorized pricing services
    categories: [{
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Category price cannot be negative"]
      },
      duration: {
        type: String,
        required: true
      },
      description: {
        type: String,
        maxlength: [200, "Category description cannot exceed 200 characters"]
      }
    }],
    
    // Description for pricing approach
    description: {
      type: String,
      maxlength: [300, "Pricing description cannot exceed 300 characters"]
    }
  },

  // ========== NEW: SERVICE BREAKDOWN AVAILABILITY ==========
  hasBreakdown: {
    type: Boolean,
    default: false
  },
  breakdownSupported: {
    type: Boolean,
    default: function() {
      return ['Woodworking', 'Metalwork', 'Textile Art'].includes(this.category);
    }
  },

  // ========== EXISTING FIELDS (KEPT) ==========
  // Removed old 'price' field - replaced with pricing structure above
  duration: {
    type: String,
    required: false // Now optional since pricing.baseDuration is used for fixed pricing
  },
  locations: [{
    name: String,
    lga: String,
    type: { 
      type: String,
      enum: ['lga', 'locality']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, { 
  timestamps: true 
});

// ========== INDEXES FOR PERFORMANCE ==========
ServiceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ 'locations.lga': 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ artisan: 1 });
ServiceSchema.index({ 'pricing.type': 1 }); // NEW: Index for pricing type queries

// ========== VIRTUAL FIELDS ==========
ServiceSchema.virtual('supportsCategorizedPricing').get(function() {
  return ['Woodworking', 'Metalwork', 'Textile Art'].includes(this.category);
});

ServiceSchema.virtual('displayPrice').get(function() {
  switch (this.pricing.type) {
    case 'fixed':
      return `₦${this.pricing.basePrice.toLocaleString()}`;
    case 'negotiate':
      return 'Price on consultation';
    case 'categorized':
      const priceRange = this.pricing.categories.map(cat => cat.price);
      const min = Math.min(...priceRange);
      const max = Math.max(...priceRange);
      return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    default:
      return 'Contact for pricing';
  }
});

// ========== VALIDATION METHODS ==========
ServiceSchema.pre('save', function(next) {
  // Validate categorized pricing only for supported categories
  if (this.pricing.type === 'categorized' && !this.supportsCategorizedPricing) {
    return next(new Error(`Categorized pricing is only available for Woodworking, Metalwork, and Textile Art services`));
  }
  
  // Ensure categories exist for categorized pricing
  if (this.pricing.type === 'categorized' && (!this.pricing.categories || this.pricing.categories.length === 0)) {
    return next(new Error('Categorized pricing requires at least one category'));
  }
  
  // Set breakdown support based on category
  this.hasBreakdown = this.breakdownSupported;
  
  next();
});

// ========== INSTANCE METHODS ==========
ServiceSchema.methods.getPriceForCategory = function(categoryName) {
  if (this.pricing.type !== 'categorized') {
    return null;
  }
  
  const category = this.pricing.categories.find(cat => cat.name === categoryName);
  return category ? category.price : null;
};

ServiceSchema.methods.addCategory = function(categoryData) {
  if (this.pricing.type !== 'categorized') {
    throw new Error('Can only add categories to categorized pricing services');
  }
  
  this.pricing.categories.push(categoryData);
  return this.save();
};

ServiceSchema.methods.updateCategory = function(categoryName, updateData) {
  if (this.pricing.type !== 'categorized') {
    throw new Error('Can only update categories on categorized pricing services');
  }
  
  const categoryIndex = this.pricing.categories.findIndex(cat => cat.name === categoryName);
  if (categoryIndex === -1) {
    throw new Error('Category not found');
  }
  
  Object.assign(this.pricing.categories[categoryIndex], updateData);
  return this.save();
};

ServiceSchema.methods.removeCategory = function(categoryName) {
  if (this.pricing.type !== 'categorized') {
    throw new Error('Can only remove categories from categorized pricing services');
  }
  
  this.pricing.categories = this.pricing.categories.filter(cat => cat.name !== categoryName);
  return this.save();
};

ServiceSchema.methods.getAvailableCategories = function() {
  const categoryBreakdowns = {
    'Woodworking': [
      'Furniture Making', 'Cabinet Making', 'Wood Carving', 'Wood Turning',
      'Joinery', 'Restoration', 'Custom Shelving', 'Decorative Items'
    ],
    'Metalwork': [
      'Welding', 'Blacksmithing', 'Metal Fabrication', 'Jewelry Making',
      'Tool Making', 'Decorative Metalwork', 'Repair Services', 'Custom Hardware'
    ],
    'Textile Art': [
      'Weaving', 'Embroidery', 'Tailoring', 'Fabric Dyeing',
      'Quilting', 'Textile Repair', 'Custom Clothing', 'Home Textiles'
    ]
  };
  
  return categoryBreakdowns[this.category] || [];
};

// ========== STATIC METHODS ==========
ServiceSchema.statics.getByPricingType = function(pricingType) {
  return this.find({ 'pricing.type': pricingType, isActive: true });
};

ServiceSchema.statics.getCategorizedServices = function() {
  return this.find({ 
    'pricing.type': 'categorized', 
    isActive: true 
  }).populate('artisan', 'name email profileImage');
};

ServiceSchema.statics.searchWithPricing = function(searchParams) {
  const query = { isActive: true };
  
  if (searchParams.category) {
    query.category = searchParams.category;
  }
  
  if (searchParams.pricingType) {
    query['pricing.type'] = searchParams.pricingType;
  }
  
  if (searchParams.location) {
    query['locations.lga'] = new RegExp(searchParams.location, 'i');
  }
  
  if (searchParams.priceRange && searchParams.priceRange.min !== undefined) {
    // For fixed pricing services
    query['pricing.basePrice'] = {
      $gte: searchParams.priceRange.min,
      ...(searchParams.priceRange.max && { $lte: searchParams.priceRange.max })
    };
  }
  
  return this.find(query).populate('artisan', 'name email profileImage ratings');
};

export default mongoose.model("Service", ServiceSchema);