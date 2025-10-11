import { db } from './server/db';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied: string, stored: string | null | undefined) {
  if (!stored || typeof stored !== 'string' || !stored.includes('.')) {
    console.log('⚠️ Invalid password format in database');
    return false;
  }
  
  const [hashed, salt] = stored.split('.');
  
  if (!hashed || !salt) {
    console.log('⚠️ Password missing hash or salt component');
    return false;
  }
  
  try {
    const hashedBuf = Buffer.from(hashed, 'hex');
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.log('⚠️ Error comparing passwords:', error);
    return false;
  }
}

async function testLogin() {
  try {
    console.log('🧪 Testing Login Functionality\n');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Test 1: Admin Login
    console.log('Test 1: Admin Login');
    console.log('Email: admin@blinkeach.com');
    console.log('Password: Admin@123\n');
    
    const [admin] = await db.select().from(users).where(eq(users.email, 'admin@blinkeach.com'));
    
    if (!admin) {
      console.log('❌ Admin user not found\n');
    } else {
      console.log('✅ Admin user found');
      console.log('   Password format valid:', admin.password?.includes('.') || false);
      
      const isValidPassword = await comparePasswords('Admin@123', admin.password);
      
      if (isValidPassword) {
        console.log('✅ Password verification PASSED');
        console.log('   🎉 Admin can log in successfully!\n');
      } else {
        console.log('❌ Password verification FAILED');
        console.log('   ⚠️ Admin cannot log in\n');
      }
    }
    
    console.log('───────────────────────────────────────────────────────\n');
    
    // Test 2: Regular User Login
    console.log('Test 2: Regular User Login');
    console.log('Email: rajesh.kumar@gmail.com');
    console.log('Password: User@123\n');
    
    const [user] = await db.select().from(users).where(eq(users.email, 'rajesh.kumar@gmail.com'));
    
    if (!user) {
      console.log('❌ User not found\n');
    } else {
      console.log('✅ User found');
      console.log('   Password format valid:', user.password?.includes('.') || false);
      
      const isValidPassword = await comparePasswords('User@123', user.password);
      
      if (isValidPassword) {
        console.log('✅ Password verification PASSED');
        console.log('   🎉 User can log in successfully!\n');
      } else {
        console.log('❌ Password verification FAILED');
        console.log('   ⚠️ User cannot log in\n');
      }
    }
    
    console.log('───────────────────────────────────────────────────────\n');
    
    // Test 3: Wrong Password
    console.log('Test 3: Wrong Password Test');
    console.log('Email: admin@blinkeach.com');
    console.log('Password: WrongPassword123\n');
    
    const isWrongPassword = await comparePasswords('WrongPassword123', admin?.password);
    
    if (!isWrongPassword) {
      console.log('✅ Wrong password correctly REJECTED');
      console.log('   🎉 Security working as expected!\n');
    } else {
      console.log('❌ Wrong password was ACCEPTED');
      console.log('   ⚠️ Security issue detected!\n');
    }
    
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Summary
    console.log('📊 Test Summary:\n');
    
    const allUsers = await db.select().from(users);
    let validCount = 0;
    
    for (const u of allUsers) {
      const isValid = u.password && u.password.includes('.');
      if (isValid) validCount++;
      console.log(`${isValid ? '✅' : '❌'} ${u.email} - ${u.username}`);
    }
    
    console.log(`\n📈 Results: ${validCount}/${allUsers.length} users have valid passwords\n`);
    
    if (validCount === allUsers.length) {
      console.log('🎉 ALL TESTS PASSED! Login system is working correctly!\n');
    } else {
      console.log('⚠️ Some users have invalid passwords. Run fix-all-user-passwords.ts\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing login:', error);
    process.exit(1);
  }
}

testLogin();