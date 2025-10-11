/**
 * Script to fix the misspelled table name in PostgreSQL database
 * Renames: product_varients -> product_variants
 */

import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

async function fixTableName() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔍 Checking current table name...');
    
    // Check if the misspelled table exists
    const checkOldTable = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'product_varients'
    `);

    if (checkOldTable.rows.length === 0) {
      console.log('✅ Table "product_varients" not found. Checking if "product_variants" already exists...');
      
      const checkNewTable = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_variants'
      `);

      if (checkNewTable.rows.length > 0) {
        console.log('✅ Table "product_variants" already exists with correct spelling!');
        console.log('✅ No action needed.');
      } else {
        console.log('❌ Neither "product_varients" nor "product_variants" table found!');
        console.log('❌ Please check your database schema.');
      }
      
      await pool.end();
      return;
    }

    console.log('📝 Found misspelled table "product_varients". Renaming to "product_variants"...');

    // Rename the table
    await pool.query('ALTER TABLE product_varients RENAME TO product_variants');

    console.log('✅ Successfully renamed table from "product_varients" to "product_variants"');

    // Verify the rename
    const verify = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'product_variants'
    `);

    if (verify.rows.length > 0) {
      console.log('✅ Verification successful! Table "product_variants" now exists.');
      
      // Count rows
      const count = await pool.query('SELECT COUNT(*) FROM product_variants');
      console.log(`📊 Table contains ${count.rows[0].count} variant records.`);
    } else {
      console.log('❌ Verification failed! Please check your database manually.');
    }

  } catch (error) {
    console.error('❌ Error fixing table name:', error);
    console.error('Error details:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the fix
fixTableName();