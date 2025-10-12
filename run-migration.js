import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📖 Reading migration file...');
    const migrationSQL = fs.readFileSync('./migrate-order-id-to-bigint.sql', 'utf8');
    
    console.log('🚀 Running migration...\n');
    await client.query(migrationSQL);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('📊 Order ID column is now BIGINT and can handle large values.\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed.');
  }
}

runMigration();