// seed-adverts.js - Populate richContent for all existing services
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Service from '../models/service.js';
import {
  CATEGORY_IMAGES,
  getFeatureTemplate,
  getImageTextVariant,
  getCategoryImages,
  hashServiceId
} from './data/advertTemplates.js';

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

// ========== DATABASE CONNECTION ==========
const connectDB = async () => {
  try {
    // Use MONGODB_URI or MONGO_URI from environment only - NO hardcoded credentials
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('❌ MONGODB_URI or MONGO_URI environment variable is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// ========== IMAGE VALIDATION ==========
const imageCache = new Map();

async function validateImageUrl(url) {
  // Check cache first
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const isValid = response.ok;
    imageCache.set(url, isValid);
    return isValid;
  } catch (error) {
    console.warn(`⚠️ Image validation failed for ${url}:`, error.message);
    imageCache.set(url, false);
    return false;
  }
}

async function getValidImage(images, serviceId) {
  for (const url of images) {
    const isValid = await validateImageUrl(url);
    if (isValid) {
      return url;
    }
  }
  
  // Fallback to first image if all validation fails
  console.warn(`⚠️ All images failed validation for service ${serviceId}, using first image as fallback`);
  return images[0];
}

// ========== ADVERT GENERATION ==========
async function generateAdvertContent(service) {
  const serviceId = service._id.toString();
  const category = service.category;
  
  // Get images for this category
  const categoryImages = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Other'];
  const mainImage = await getValidImage([categoryImages[0]], serviceId);
  
  // Get additional images for gallery
  const galleryImages = await Promise.all(
    getCategoryImages(category, serviceId, 3).map(url => getValidImage([url], serviceId))
  );

  // Get feature template
  const features = getFeatureTemplate(category, serviceId);

  // Trim service description for subtitle (max 160 chars)
  const subtitle = service.description
    ? service.description.substring(0, 157) + (service.description.length > 157 ? '...' : '')
    : 'Quality craftsmanship tailored to your needs';

  // Get varied image text content
  const leftVariant = getImageTextVariant('left', 0, serviceId);
  const rightVariant = getImageTextVariant('right', 0, serviceId);

  // Build blocks
  const blocks = [
    // 1. Banner
    {
      id: uuidv4(),
      type: 'banner',
      order: 0,
      data: {
        image: mainImage,
        alt: `${service.title} showcase`
      }
    },
    
    // 2. Heading
    {
      id: uuidv4(),
      type: 'heading',
      order: 1,
      data: {
        title: service.title,
        subtitle: subtitle
      }
    },
    
    // 3. Feature Strip
    {
      id: uuidv4(),
      type: 'featureStrip',
      order: 2,
      data: {
        items: features
      }
    },
    
    // 4. Image + Text (left)
    {
      id: uuidv4(),
      type: 'imageText',
      order: 3,
      data: {
        image: galleryImages[0],
        alt: `${service.title} detail`,
        title: `${leftVariant.titlePrefix} ${service.title}`,
        text: leftVariant.text,
        imagePosition: 'left'
      }
    },
    
    // 5. Image + Text (right)
    {
      id: uuidv4(),
      type: 'imageText',
      order: 4,
      data: {
        image: galleryImages[1],
        alt: `${service.title} process`,
        title: `${rightVariant.titlePrefix} ${service.title} Special`,
        text: rightVariant.text,
        imagePosition: 'right'
      }
    }
  ];

  // 6. Optionally add gallery (for some services)
  const hash = hashServiceId(serviceId);
  if (hash % 3 === 0) { // Add gallery to 1/3 of services
    blocks.push({
      id: uuidv4(),
      type: 'gallery',
      order: 5,
      data: {
        images: galleryImages.map((url, idx) => ({
          image: url,
          alt: `${service.title} gallery ${idx + 1}`
        }))
      }
    });
  }

  return {
    enabled: true,
    blocks,
    updatedAt: new Date(),
    seeded: true
  };
}

// ========== BATCH PROCESSING ==========
async function processServices() {
  console.log('\n🚀 Starting service advert seeding...\n');
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Force: ${isForce ? 'YES' : 'NO'}\n`);

  const stats = {
    total: 0,
    updated: 0,
    skipped: 0,
    failed: 0
  };

  try {
    // Build query
    const query = isForce 
      ? {} 
      : {
          $or: [
            { 'richContent.blocks': { $exists: false } },
            { 'richContent.blocks': { $size: 0 } }
          ]
        };

    // Get services
    const services = await Service.find(query);
    stats.total = services.length;

    console.log(`📊 Found ${stats.total} services to process\n`);

    if (stats.total === 0) {
      console.log('✅ No services need advert content');
      return stats;
    }

    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < services.length; i += batchSize) {
      const batch = services.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(services.length / batchSize)}...`);

      for (const service of batch) {
        try {
          // Check if should skip
          if (!isForce && service.richContent?.blocks?.length > 0) {
            console.log(`  ⏭️  Skipped: ${service.title} (already has content)`);
            stats.skipped++;
            continue;
          }

          // Generate content
          console.log(`  🔄 Processing: ${service.title} (${service.category})`);
          
          const advertContent = await generateAdvertContent(service);

          if (isDryRun) {
            console.log(`  ✓ Would update: ${service.title} with ${advertContent.blocks.length} blocks`);
            stats.updated++;
          } else {
            // Update service
            service.richContent = advertContent;
            await service.save();
            console.log(`  ✅ Updated: ${service.title} with ${advertContent.blocks.length} blocks`);
            stats.updated++;
          }
        } catch (error) {
          console.error(`  ❌ Failed: ${service.title} - ${error.message}`);
          stats.failed++;
        }
      }
    }

    return stats;
  } catch (error) {
    console.error('❌ Error processing services:', error);
    throw error;
  }
}

// ========== MAIN EXECUTION ==========
async function main() {
  try {
    await connectDB();
    
    const stats = await processServices();

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total services found:    ${stats.total}`);
    console.log(`Successfully updated:    ${stats.updated} ${isDryRun ? '(dry run)' : ''}`);
    console.log(`Skipped:                 ${stats.skipped}`);
    console.log(`Failed:                  ${stats.failed}`);
    console.log('='.repeat(60) + '\n');

    if (isDryRun) {
      console.log('ℹ️  This was a dry run. Run without --dry-run to apply changes.\n');
    } else {
      console.log('✅ Advert seeding completed!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run the script
main();
