import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

console.log('🔍 Testing database connection...\n');
console.log('Database Host:', process.env.PGHOST);
console.log('Database Name:', process.env.PGDATABASE);
console.log('Database User:', process.env.PGUSER);
console.log('Database Port:', process.env.PGPORT);
console.log('SSL Enabled: Yes (rejectUnauthorized: false)\n');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
});

try {
  console.log('⏳ Attempting to connect...');
  const client = await pool.connect();
  console.log('✅ Successfully connected to the database!\n');
  
  const result = await client.query('SELECT NOW(), version()');
  console.log('✅ Current database time:', result.rows[0].now);
  console.log('✅ PostgreSQL version:', result.rows[0].version.split(',')[0]);
  
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  
  console.log('\n📋 Tables in database (' + tablesResult.rows.length + ' total):');
  if (tablesResult.rows.length === 0) {
    console.log('  (No tables found - database might be empty)');
  } else {
    tablesResult.rows.forEach(row => {
      console.log('  -', row.table_name);
    });
  }
  
  client.release();
  await pool.end();
  console.log('\n✅ Connection test completed successfully!');
  console.log('\n💡 Your database is working! You can now use pgAdmin with these settings:');
  console.log('   - SSL Mode: Prefer (or Allow)');
  console.log('   - Make sure to check "Save password"');
  
} catch (error) {
  console.error('\n❌ Database connection error:', error.message);
  console.error('\n🔧 Troubleshooting tips:');
  console.error('   1. Check if your Render database is active (not suspended)');
  console.error('   2. Verify your internet connection');
  console.error('   3. Check Render dashboard for database status');
  console.error('   4. Free tier databases may sleep - try again in 30 seconds');
  await pool.end();
  process.exit(1);
}