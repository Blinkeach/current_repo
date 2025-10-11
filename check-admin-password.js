import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function checkAdminPassword() {
  try {
    const [admin] = await db.select().from(users).where(eq(users.email, 'admin@blinkeach.com'));
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    console.log('✅ Admin user found:');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Username:', admin.username);
    console.log('Password field exists:', !!admin.password);
    console.log('Password value:', admin.password ? `${admin.password.substring(0, 20)}...` : 'NULL/UNDEFINED');
    console.log('Password length:', admin.password ? admin.password.length : 0);
    console.log('Password contains dot:', admin.password ? admin.password.includes('.') : false);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminPassword();