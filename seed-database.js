import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Read SQL files
    const sql1 = fs.readFileSync(path.join(__dirname, 'seed-database.sql'), 'utf8');
    const sql2 = fs.readFileSync(path.join(__dirname, 'seed-database-part2.sql'), 'utf8');
    
    console.log('📄 Executing Part 1: Categories, Products, and Users...');
    await client.query(sql1);
    console.log('✅ Part 1 completed successfully!\n');
    
    console.log('📄 Executing Part 2: Variants, Reviews, and Related Data...');
    await client.query(sql2);
    console.log('✅ Part 2 completed successfully!\n');
    
    // Get counts
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) FROM users'),
      client.query('SELECT COUNT(*) FROM categories'),
      client.query('SELECT COUNT(*) FROM products'),
      client.query('SELECT COUNT(*) FROM product_variants'),
      client.query('SELECT COUNT(*) FROM reviews'),
      client.query('SELECT COUNT(*) FROM user_addresses'),
      client.query('SELECT COUNT(*) FROM referrals'),
      client.query('SELECT COUNT(*) FROM wishlist_items'),
    ]);
    
    console.log('📊 Database Seeding Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users:              ${counts[0].rows[0].count}`);
    console.log(`📁 Categories:         ${counts[1].rows[0].count}`);
    console.log(`📦 Products:           ${counts[2].rows[0].count}`);
    console.log(`🎨 Product Variants:   ${counts[3].rows[0].count}`);
    console.log(`⭐ Reviews:            ${counts[4].rows[0].count}`);
    console.log(`📍 User Addresses:     ${counts[5].rows[0].count}`);
    console.log(`🎁 Referral Codes:     ${counts[6].rows[0].count}`);
    console.log(`❤️  Wishlist Items:     ${counts[7].rows[0].count}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('🎉 Database seeded successfully!\n');
    
    console.log('📝 Test Credentials:');
    console.log('───────────────────────────────────────');
    console.log('Admin Account:');
    console.log('  Username: admin');
    console.log('  Password: password123');
    console.log('  Email:    admin@blinkeach.com\n');
    console.log('Customer Accounts:');
    console.log('  Username: rajesh_kumar');
    console.log('  Username: priya_sharma');
    console.log('  Username: amit_patel');
    console.log('  Username: sneha_reddy');
    console.log('  Username: vikram_singh');
    console.log('  Password: password123 (for all)\n');
    
    console.log('🛍️  Product Categories:');
    console.log('───────────────────────────────────────');
    console.log('  • Electronics (Smartphones, Laptops, Headphones, Cameras)');
    console.log('  • Fashion (Men\'s/Women\'s Clothing, Footwear)');
    console.log('  • Home & Kitchen (Appliances, Cookware)');
    console.log('  • Beauty & Personal Care');
    console.log('  • Sports & Fitness');
    console.log('  • Books & Stationery');
    console.log('  • Toys & Games');
    console.log('  • Groceries\n');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('✨ All done! Your database is ready to use.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });