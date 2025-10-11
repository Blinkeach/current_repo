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

async function fixAllUserPasswords() {
  try {
    console.log('🔐 Checking all user passwords...\n');
    
    // Get all users
    const allUsers = await db.select().from(users);
    
    console.log(`📊 Found ${allUsers.length} users in database\n`);
    
    let fixedCount = 0;
    
    for (const user of allUsers) {
      const isValidPassword = user.password && typeof user.password === 'string' && user.password.includes('.');
      
      if (!isValidPassword) {
        console.log(`❌ Invalid password for user: ${user.email}`);
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   👤 Username: ${user.username}`);
        console.log(`   🔑 Password status: ${user.password ? 'Invalid format' : 'NULL'}`);
        
        // Set a default password based on username
        const defaultPassword = user.isAdmin ? 'Admin@123' : 'User@123';
        const hashedPassword = await hashPassword(defaultPassword);
        
        await db.update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, user.id));
        
        console.log(`   ✅ Password reset to: ${defaultPassword}`);
        console.log('');
        fixedCount++;
      } else {
        console.log(`✅ Valid password for: ${user.email} (${user.username})`);
      }
    }
    
    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   Fixed passwords: ${fixedCount}`);
    console.log(`   Valid passwords: ${allUsers.length - fixedCount}`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    if (fixedCount > 0) {
      console.log('⚠️  Default passwords set:');
      console.log('   - Admin users: Admin@123');
      console.log('   - Regular users: User@123');
      console.log('   Please ask users to change their passwords!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing user passwords:', error);
    process.exit(1);
  }
}

fixAllUserPasswords();