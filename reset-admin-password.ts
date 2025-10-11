import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting admin password...\n');
    
    // Check if admin user exists
    const [admin] = await db.select().from(users).where(eq(users.email, 'admin@blinkeach.com'));
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin user...\n');
      
      const hashedPassword = await hashPassword('Admin@123');
      
      const [newAdmin] = await db.insert(users).values({
        username: 'admin',
        email: 'admin@blinkeach.com',
        password: hashedPassword,
        fullName: 'Admin User',
        isAdmin: true,
        emailVerified: true,
      }).returning();
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@blinkeach.com');
      console.log('🔑 Password: Admin@123');
      console.log('🆔 User ID:', newAdmin.id);
      console.log('\n⚠️  Please change this password after first login!\n');
    } else {
      console.log('✅ Admin user found');
      console.log('🆔 User ID:', admin.id);
      console.log('📧 Email:', admin.email);
      console.log('👤 Username:', admin.username);
      console.log('🔑 Current password valid:', admin.password ? admin.password.includes('.') : false);
      console.log('\n🔄 Updating password...\n');
      
      const hashedPassword = await hashPassword('Admin@123');
      
      await db.update(users)
        .set({ 
          password: hashedPassword,
          emailVerified: true,
          isAdmin: true 
        })
        .where(eq(users.id, admin.id));
      
      console.log('✅ Admin password reset successfully!');
      console.log('📧 Email: admin@blinkeach.com');
      console.log('🔑 New Password: Admin@123');
      console.log('\n⚠️  Please change this password after login!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  }
}

resetAdminPassword();