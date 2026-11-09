import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';

// Configuration for default administrative accounts
const DEFAULT_ADMINS = [
  {
    fullName: 'Admin1',
    email: 'janiduviduranga78@gmail.com',
    password: process.env.ADMIN1_PASSWORD,
    role: 'admin',
  },
  {
    fullName: 'Admin2',
    email: 'prarthanaudari2006@gmail.com',
    password: process.env.ADMIN2_PASSWORD,
    role: 'admin',
  },
];

async function seedAdmins() {
  console.log('====================================================');
  console.log('  🎂 Cake of Paradise - Administrative Seeding CLI  ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas.\n');

    // Parse any additional admins defined in environment variables
    let adminsToSeed = [...DEFAULT_ADMINS];

    if (process.env.ADMIN_SEEDS) {
      try {
        const parsed = JSON.parse(process.env.ADMIN_SEEDS);
        if (Array.isArray(parsed)) {
          adminsToSeed = [...adminsToSeed, ...parsed];
        }
      } catch (parseErr) {
        console.warn('⚠️ Warning: ADMIN_SEEDS could not be parsed as JSON, using defaults.');
      }
    }

    if (process.env.ADMIN_EMAILS) {
      const extraEmails = process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase());
      extraEmails.forEach((email) => {
        if (email && !adminsToSeed.some((a) => a.email.toLowerCase() === email)) {
          adminsToSeed.push({
            fullName: 'Designated Admin',
            email,
            password: process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPass123!',
            role: 'admin',
          });
        }
      });
    }

    let createdCount = 0;
    let promotedCount = 0;
    let existingCount = 0;

    for (const adminData of adminsToSeed) {
      const normalizedEmail = adminData.email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        if (existingUser.role !== 'admin') {
          existingUser.role = 'admin';
          await existingUser.save();
          console.log(`  ⭐ [PROMOTED] ${normalizedEmail} -> Role updated to 'admin'`);
          promotedCount++;
        } else {
          console.log(`  ✓ [EXISTS]   ${normalizedEmail} -> Already has 'admin' privileges`);
          existingCount++;
        }
      } else {
        // Create new user; pre-save hook will hash password with bcrypt
        await User.create({
          fullName: adminData.fullName || 'Admin User',
          email: normalizedEmail,
          password: adminData.password,
          role: 'admin',
        });
        console.log(`  ✨ [CREATED]  ${normalizedEmail} -> New admin account created`);
        createdCount++;
      }
    }

    console.log('\n----------------------------------------------------');
    console.log(`🎉 Seeding Complete!`);
    console.log(`   - Created:  ${createdCount}`);
    console.log(`   - Promoted: ${promotedCount}`);
    console.log(`   - Existing: ${existingCount}`);
    console.log(`   - Total:    ${adminsToSeed.length}`);
    console.log('----------------------------------------------------\n');

    await mongoose.connection.close();
    console.log('🔒 Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    try {
      await mongoose.connection.close();
    } catch {
      // ignore
    }
    process.exit(1);
  }
}

seedAdmins();
