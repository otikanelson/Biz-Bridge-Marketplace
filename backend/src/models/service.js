// models/service.js - Updated for No-Payment System + Featured/Popular flags
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

  // ========== PRICING STRUCTURE ==========
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'negotiate', 'categorized'],
      required: [true, "Pricing type is required"]
    },
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
    categories: [{
      name: { type: String, required: true },
      price: { type: Number, required: true, min: [0, "Category price cannot be negative"] },
      duration: { type: String, required: true },
      description: { type: String, maxlength: [200, "Category description cannot exceed 200 characters"] }
    }],
    description: {
      type: String,
      maxlength: [300, "Pricing description cannot exceed 300 characters"]
    }
  },

  // ========== SERVICE BREAKDOWN AVAILABILITY ==========
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

  // ========== NEW: FEATURED / POPULAR FLAGS ==========
  // These drive the homepage's "Featured Services" and "Popular Services" rails,
  // independent of the artisan-level `featured` flag on the User model.
  featured: {
    isFeatured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, default: 0 } // lower = shown first
  },
  popular: {
    isPopular: { type: Boolean, default: false, index: true },
    popularOrder: { type: Number, default: 0 },
    // snapshot used to justify/rank "popular" status; kept in sync by booking logic
    bookingCount: { type: Number, default: 0 }
  },

  // ========== EXISTING FIELDS ==========
  duration: {
    type: String,
    required: false
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
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
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
ServiceSchema.index({ 'pricing.type': 1 });
ServiceSchema.index({ 'featured.isFeatured': 1, 'featured.featuredOrder': 1 });
ServiceSchema.index({ 'popular.isPopular': 1, 'popular.popularOrder': 1 });

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
    case 'categorized': {
      const priceRange = this.pricing.categories.map(cat => cat.price);
      const min = Math.min(...priceRange);
      const max = Math.max(...priceRange);
      return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    }
    default:
      return 'Contact for pricing';
  }
});

// ========== VALIDATION METHODS ==========
ServiceSchema.pre('save', function(next) {
  if (this.pricing.type === 'categorized' && !this.supportsCategorizedPricing) {
    return next(new Error(`Categorized pricing is only available for Woodworking, Metalwork, and Textile Art services`));
  }
  if (this.pricing.type === 'categorized' && (!this.pricing.categories || this.pricing.categories.length === 0)) {
    return next(new Error('Categorized pricing requires at least one category'));
  }
  this.hasBreakdown = this.breakdownSupported;
  next();
});

// ========== INSTANCE METHODS ==========
ServiceSchema.methods.getPriceForCategory = function(categoryName) {
  if (this.pricing.type !== 'categorized') return null;
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
  if (categoryIndex === -1) throw new Error('Category not found');
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
    'Woodworking': ['Furniture Making', 'Cabinet Making', 'Wood Carving', 'Wood Turning', 'Joinery', 'Restoration', 'Custom Shelving', 'Decorative Items'],
    'Metalwork': ['Welding', 'Blacksmithing', 'Metal Fabrication', 'Jewelry Making', 'Tool Making', 'Decorative Metalwork', 'Repair Services', 'Custom Hardware'],
    'Textile Art': ['Weaving', 'Embroidery', 'Tailoring', 'Fabric Dyeing', 'Quilting', 'Textile Repair', 'Custom Clothing', 'Home Textiles']
  };
  return categoryBreakdowns[this.category] || [];
};

// Mark/unmark this service as featured or popular
ServiceSchema.methods.setFeatured = function(isFeatured, order = 0) {
  this.featured.isFeatured = isFeatured;
  this.featured.featuredOrder = order;
  return this.save();
};

ServiceSchema.methods.setPopular = function(isPopular, order = 0) {
  this.popular.isPopular = isPopular;
  this.popular.popularOrder = order;
  return this.save();
};

// ========== STATIC METHODS ==========
ServiceSchema.statics.getByPricingType = function(pricingType) {
  return this.find({ 'pricing.type': pricingType, isActive: true });
};

ServiceSchema.statics.getCategorizedServices = function() {
  return this.find({ 'pricing.type': 'categorized', isActive: true }).populate('artisan', 'name email profileImage');
};

ServiceSchema.statics.getFeaturedServices = function(limit = 6) {
  return this.find({ isActive: true, 'featured.isFeatured': true })
    .sort({ 'featured.featuredOrder': 1, createdAt: -1 })
    .limit(limit)
    .populate('artisan', 'businessName contactName profileImage analytics');
};

ServiceSchema.statics.getPopularServices = function(limit = 6) {
  return this.find({ isActive: true, 'popular.isPopular': true })
    .sort({ 'popular.popularOrder': 1, 'popular.bookingCount': -1 })
    .limit(limit)
    .populate('artisan', 'businessName contactName profileImage analytics');
};

ServiceSchema.statics.searchWithPricing = function(searchParams) {
  const query = { isActive: true };
  if (searchParams.category) query.category = searchParams.category;
  if (searchParams.pricingType) query['pricing.type'] = searchParams.pricingType;
  if (searchParams.location) query['locations.lga'] = new RegExp(searchParams.location, 'i');
  if (searchParams.priceRange && searchParams.priceRange.min !== undefined) {
    query['pricing.basePrice'] = {
      $gte: searchParams.priceRange.min,
      ...(searchParams.priceRange.max && { $lte: searchParams.priceRange.max })
    };
  }
  return this.find(query).populate('artisan', 'name email profileImage ratings');
};

export default mongoose.model("Service", ServiceSchema);