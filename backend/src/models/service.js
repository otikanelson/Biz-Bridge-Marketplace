// models/service.js
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
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
    ]
  },
  price: {
    type: String,
    required: [true, "Price information is required"]
  },
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

// Add indexes for faster querying
ServiceSchema.index({ title: 'text', description: 'text', tags: 'text' });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ 'locations.lga': 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ artisan: 1 });

export default mongoose.model("Service", ServiceSchema);