/**
 * Database Diagnostic Script
 * Checks database connection and table structure
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

async function checkDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 DATABASE DIAGNOSTIC REPORT');
    console.log('=' .repeat(60));
    
    // Test connection
    console.log('\n1️⃣ Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log(`   Server time: ${connectionTest.rows[0].now}`);

    // Check all tables
    console.log('\n2️⃣ Checking all tables in database...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`✅ Found ${tables.rows.length} tables:`);
    tables.rows.forEach(row => {
      const marker = row.table_name.includes('variant') ? '👉' : '  ';
      console.log(`   ${marker} ${row.table_name}`);
    });

    // Check for variant tables specifically
    console.log('\n3️⃣ Checking for product variant tables...');
    const variantTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%variant%'
    `);
    
    if (variantTables.rows.length === 0) {
      console.log('❌ No variant tables found!');
    } else {
      variantTables.rows.forEach(row => {
        if (row.table_name === 'product_variants') {
          console.log(`✅ ${row.table_name} (CORRECT spelling)`);
        } else if (row.table_name === 'product_varients') {
          console.log(`⚠️  ${row.table_name} (MISSPELLED - needs to be "product_variants")`);
        } else {
          console.log(`   ${row.table_name}`);
        }
      });
    }

    // Check products table
    console.log('\n4️⃣ Checking products table...');
    const productCount = await pool.query('SELECT COUNT(*) FROM products');
    console.log(`✅ Products table exists with ${productCount.rows[0].count} products`);

    // Check if variant table exists and count records
    console.log('\n5️⃣ Checking variant records...');
    
    // Try correct spelling first
    try {
      const variantCount = await pool.query('SELECT COUNT(*) FROM product_variants');
      console.log(`✅ product_variants table exists with ${variantCount.rows[0].count} variant records`);
      
      // Show sample variants
      const sampleVariants = await pool.query(`
        SELECT id, product_id, color_name, size_name, stock 
        FROM product_variants 
        LIMIT 5
      `);
      
      if (sampleVariants.rows.length > 0) {
        console.log('\n   Sample variants:');
        sampleVariants.rows.forEach(v => {
          console.log(`   - ID: ${v.id}, Product: ${v.product_id}, Color: ${v.color_name}, Size: ${v.size_name}, Stock: ${v.stock}`);
        });
      }
    } catch (error) {
      console.log('❌ product_variants table does NOT exist');
      
      // Try misspelled version
      try {
        const varientCount = await pool.query('SELECT COUNT(*) FROM product_varients');
        console.log(`⚠️  product_varients table exists with ${varientCount.rows[0].count} variant records`);
        console.log('⚠️  TABLE NAME IS MISSPELLED! Should be "product_variants"');
        console.log('⚠️  Run: node fix_table_name.js to fix this issue');
        
        // Show sample variants
        const sampleVarients = await pool.query(`
          SELECT id, product_id, color_name, size_name, stock 
          FROM product_varients 
          LIMIT 5
        `);
        
        if (sampleVarients.rows.length > 0) {
          console.log('\n   Sample variants (from misspelled table):');
          sampleVarients.rows.forEach(v => {
            console.log(`   - ID: ${v.id}, Product: ${v.product_id}, Color: ${v.color_name}, Size: ${v.size_name}, Stock: ${v.stock}`);
          });
        }
      } catch (error2) {
        console.log('❌ product_varients table also does NOT exist');
        console.log('❌ No variant table found at all!');
      }
    }

    // Check table structure
    console.log('\n6️⃣ Checking table structure...');
    try {
      const columns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name IN ('product_variants', 'product_varients')
        ORDER BY table_name, ordinal_position
      `);
      
      if (columns.rows.length > 0) {
        console.log('✅ Variant table columns:');
        columns.rows.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
        });
      }
    } catch (error) {
      console.log('⚠️  Could not retrieve table structure');
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSTIC COMPLETE');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR during diagnostic:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 Database host not found. Check your DATABASE_URL.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Connection refused. Is your database running?');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your database credentials.');
    }
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the diagnostic
checkDatabase();