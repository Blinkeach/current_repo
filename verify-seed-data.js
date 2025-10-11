import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyData() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Verifying Seed Data...\n');
    
    // Sample products from each category
    console.log('📱 Sample Electronics Products:');
    const electronics = await client.query(`
      SELECT name, price/100 as price_inr, stock, category 
      FROM products 
      WHERE category IN ('Smartphones', 'Laptops', 'Headphones')
      LIMIT 5
    `);
    electronics.rows.forEach(p => {
      console.log(`  • ${p.name} - ₹${p.price_inr.toLocaleString('en-IN')} (Stock: ${p.stock})`);
    });
    
    console.log('\n👕 Sample Fashion Products:');
    const fashion = await client.query(`
      SELECT name, price/100 as price_inr, stock, category 
      FROM products 
      WHERE category IN ('Men''s Clothing', 'Women''s Clothing', 'Footwear')
      LIMIT 5
    `);
    fashion.rows.forEach(p => {
      console.log(`  • ${p.name} - ₹${p.price_inr.toLocaleString('en-IN')} (Stock: ${p.stock})`);
    });
    
    console.log('\n🏠 Sample Home & Kitchen Products:');
    const home = await client.query(`
      SELECT name, price/100 as price_inr, stock 
      FROM products 
      WHERE category = 'Home & Kitchen'
      LIMIT 3
    `);
    home.rows.forEach(p => {
      console.log(`  • ${p.name} - ₹${p.price_inr.toLocaleString('en-IN')} (Stock: ${p.stock})`);
    });
    
    console.log('\n🛒 Sample Grocery Products:');
    const groceries = await client.query(`
      SELECT name, price/100 as price_inr, stock 
      FROM products 
      WHERE category = 'Groceries'
      LIMIT 4
    `);
    groceries.rows.forEach(p => {
      console.log(`  • ${p.name} - ₹${p.price_inr.toLocaleString('en-IN')} (Stock: ${p.stock})`);
    });
    
    // Product variants
    console.log('\n\n🎨 Sample Product Variants:');
    const variants = await client.query(`
      SELECT p.name, pv.color_name, pv.size_name, pv.stock, pv.sku
      FROM product_variants pv
      JOIN products p ON p.id = pv.product_id
      WHERE p.name IN ('iPhone 15 Pro Max', 'Levi''s 511 Slim Fit Jeans', 'Lakme Absolute Lipstick')
      ORDER BY p.name, pv.color_name, pv.size_name
      LIMIT 10
    `);
    variants.rows.forEach(v => {
      console.log(`  • ${v.name} - ${v.color_name} / ${v.size_name} (Stock: ${v.stock}) [${v.sku}]`);
    });
    
    // Reviews
    console.log('\n\n⭐ Sample Product Reviews:');
    const reviews = await client.query(`
      SELECT p.name, u.username, r.rating, r.title, r.is_verified_purchase
      FROM reviews r
      JOIN products p ON p.id = r.product_id
      JOIN users u ON u.id = r.user_id
      ORDER BY r.created_at DESC
      LIMIT 5
    `);
    reviews.rows.forEach(r => {
      const verified = r.is_verified_purchase ? '✓ Verified' : '';
      console.log(`  • ${r.name} - ${r.rating}★ by ${r.username} ${verified}`);
      console.log(`    "${r.title}"`);
    });
    
    // Users
    console.log('\n\n👥 User Accounts:');
    const users = await client.query(`
      SELECT username, email, full_name, city, is_admin
      FROM users
      ORDER BY is_admin DESC, id
    `);
    users.rows.forEach(u => {
      const role = u.is_admin ? '[ADMIN]' : '[Customer]';
      console.log(`  ${role} ${u.username} - ${u.full_name} (${u.city})`);
    });
    
    // Categories
    console.log('\n\n📁 Categories:');
    const categories = await client.query(`
      SELECT name, slug, 
        (SELECT COUNT(*) FROM products WHERE category = categories.name) as product_count
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY display_order
    `);
    categories.rows.forEach(c => {
      console.log(`  • ${c.name} (${c.product_count} products)`);
    });
    
    // Wishlist
    console.log('\n\n❤️  Wishlist Items:');
    const wishlist = await client.query(`
      SELECT u.username, p.name
      FROM wishlist_items w
      JOIN users u ON u.id = w.user_id
      JOIN products p ON p.id = w.product_id
      LIMIT 5
    `);
    wishlist.rows.forEach(w => {
      console.log(`  • ${w.username} saved "${w.name}"`);
    });
    
    // Summary
    console.log('\n\n═══════════════════════════════════════');
    console.log('✅ Data Verification Complete!');
    console.log('═══════════════════════════════════════');
    console.log('All seed data has been successfully inserted.');
    console.log('Your database is ready for testing!\n');
    
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

verifyData();