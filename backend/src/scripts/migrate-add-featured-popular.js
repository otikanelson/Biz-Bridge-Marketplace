// backend/src/scripts/migrate-add-featured-popular.js
//
// Backfills the new `featured` and `popular` sub-documents onto any Service
// records that predate this change (e.g. anything inserted before the
// isFeatured/isPopular fields existed on the schema).
//
// Safe to run multiple times — it only touches documents missing the fields.
//
// Usage: node backend/src/scripts/migrate-add-featured-popular.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const servicesCollection = mongoose.connection.db.collection('services');

  // Only backfill docs that don't already have the new sub-documents
  const filter = {
    $or: [
      { featured: { $exists: false } },
      { popular: { $exists: false } }
    ]
  };

  const toUpdate = await servicesCollection.countDocuments(filter);
  console.log(`📊 Found ${toUpdate} service(s) needing the featured/popular fields`);

  if (toUpdate === 0) {
    console.log('✅ Nothing to migrate.');
    await mongoose.disconnect();
    return;
  }

  const result = await servicesCollection.updateMany(filter, {
    $set: {
      featured: { isFeatured: false, featuredOrder: 0 },
      popular: { isPopular: false, popularOrder: 0, bookingCount: 0 }
    }
  });

  console.log(`✅ Migration complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

  await mongoose.disconnect();
  console.log('✅ Disconnected from MongoDB');
}

migrate().catch(async (err) => {
  console.error('❌ Migration failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});