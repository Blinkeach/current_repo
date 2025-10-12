import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function checkOrders() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Check all orders
    console.log('📊 Fetching all orders...\n');
    const result = await client.query(`
      SELECT 
        id, 
        user_id, 
        status, 
        total_amount, 
        payment_method,
        razorpay_order_id,
        razorpay_payment_id,
        tracking_id,
        created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 20
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  No orders found in the database.');
    } else {
      console.log(`Found ${result.rows.length} orders:\n`);
      console.table(result.rows);
    }

    // Check if the specific order exists
    console.log('\n🔍 Checking for order ID: 39423010000033...');
    const specificOrder = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      ['39423010000033']
    );

    if (specificOrder.rows.length > 0) {
      console.log('✅ Order found!');
      console.log(specificOrder.rows[0]);
    } else {
      console.log('❌ Order 39423010000033 does NOT exist in the database.');
      console.log('\n💡 This order ID might be:');
      console.log('   1. A Razorpay order ID (not your database order ID)');
      console.log('   2. An order that was never created');
      console.log('   3. An order from a different environment/database');
    }

    // Check razorpay_order_id column
    console.log('\n🔍 Checking if this is a Razorpay Order ID...');
    const razorpayCheck = await client.query(
      'SELECT id, razorpay_order_id, razorpay_payment_id, status FROM orders WHERE razorpay_order_id = $1',
      ['order_39423010000033']
    );

    if (razorpayCheck.rows.length > 0) {
      console.log('✅ Found order with this Razorpay Order ID!');
      console.log(razorpayCheck.rows[0]);
    } else {
      console.log('❌ No order found with Razorpay Order ID: order_39423010000033');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed.');
  }
}

checkOrders();