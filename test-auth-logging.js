/**
 * Authentication Logging Test Script
 * 
 * This script demonstrates the console logging for authentication operations.
 * Run this after starting the server to see the logs in action.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator() {
  log('\n' + '='.repeat(60), 'cyan');
}

async function testRegistration() {
  separator();
  log('📝 TEST 1: User Registration', 'bright');
  separator();
  
  const newUser = {
    email: `testuser_${Date.now()}@example.com`,
    username: `testuser_${Date.now()}`,
    password: 'password123',
    fullName: 'Test User'
  };
  
  log(`\n📧 Registering user: ${newUser.email}`, 'cyan');
  log(`👤 Username: ${newUser.username}`, 'cyan');
  log('\n⏳ Check server console for registration logs...', 'yellow');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, newUser);
    log('\n✅ Registration successful!', 'green');
    log(`🆔 User ID: ${response.data.user.id}`, 'green');
    log(`🔑 Token received: ${response.data.token.substring(0, 20)}...`, 'green');
    return response.data;
  } catch (error) {
    log('\n❌ Registration failed!', 'red');
    log(`⚠️  Error: ${error.response?.data?.error || error.message}`, 'red');
    return null;
  }
}

async function testLogin() {
  separator();
  log('🔑 TEST 2: User Login', 'bright');
  separator();
  
  const credentials = {
    email: 'admin@blinkeach.com',
    password: 'password123'
  };
  
  log(`\n📧 Logging in as: ${credentials.email}`, 'cyan');
  log('\n⏳ Check server console for login logs...', 'yellow');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    log('\n✅ Login successful!', 'green');
    log(`👤 Username: ${response.data.user.username}`, 'green');
    log(`👑 Is Admin: ${response.data.user.isAdmin ? 'Yes' : 'No'}`, 'green');
    log(`🔑 Token received: ${response.data.token.substring(0, 20)}...`, 'green');
    return response.data;
  } catch (error) {
    log('\n❌ Login failed!', 'red');
    log(`⚠️  Error: ${error.response?.data?.error || error.message}`, 'red');
    return null;
  }
}

async function testFailedLogin() {
  separator();
  log('❌ TEST 3: Failed Login (Invalid Credentials)', 'bright');
  separator();
  
  const credentials = {
    email: 'admin@blinkeach.com',
    password: 'wrongpassword'
  };
  
  log(`\n📧 Attempting login with wrong password...`, 'cyan');
  log('\n⏳ Check server console for failed login logs...', 'yellow');
  
  try {
    await axios.post(`${BASE_URL}/api/auth/login`, credentials);
    log('\n⚠️  Unexpected success!', 'yellow');
  } catch (error) {
    log('\n✅ Failed as expected!', 'green');
    log(`📝 Error message: ${error.response?.data?.error || error.message}`, 'green');
  }
}

async function testDuplicateRegistration() {
  separator();
  log('❌ TEST 4: Duplicate Registration', 'bright');
  separator();
  
  const existingUser = {
    email: 'admin@blinkeach.com',
    username: 'admin',
    password: 'password123',
    fullName: 'Admin User'
  };
  
  log(`\n📧 Attempting to register existing email: ${existingUser.email}`, 'cyan');
  log('\n⏳ Check server console for duplicate registration logs...', 'yellow');
  
  try {
    await axios.post(`${BASE_URL}/api/auth/register`, existingUser);
    log('\n⚠️  Unexpected success!', 'yellow');
  } catch (error) {
    log('\n✅ Failed as expected!', 'green');
    log(`📝 Error message: ${error.response?.data?.error || error.message}`, 'green');
  }
}

async function testLogout(token) {
  separator();
  log('🚪 TEST 5: User Logout', 'bright');
  separator();
  
  log('\n🔓 Logging out user...', 'cyan');
  log('\n⏳ Check server console for logout logs...', 'yellow');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    log('\n✅ Logout successful!', 'green');
    log(`📝 Message: ${response.data.message}`, 'green');
  } catch (error) {
    log('\n❌ Logout failed!', 'red');
    log(`⚠️  Error: ${error.response?.data?.error || error.message}`, 'red');
  }
}

async function runTests() {
  log('\n🔐 AUTHENTICATION LOGGING TEST SUITE', 'bright');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('\n📋 This script will test all authentication endpoints', 'blue');
  log('👀 Watch the SERVER CONSOLE for detailed logging output', 'yellow');
  log('\n🚀 Starting tests in 2 seconds...', 'magenta');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Test 1: Registration
    const registrationResult = await testRegistration();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Login
    const loginResult = await testLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Failed Login
    await testFailedLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 4: Duplicate Registration
    await testDuplicateRegistration();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 5: Logout (if we have a token)
    if (loginResult?.token) {
      await testLogout(loginResult.token);
    }
    
    separator();
    log('\n✅ ALL TESTS COMPLETED!', 'bright');
    log('\n📊 Summary:', 'cyan');
    log('   • Check server console for detailed authentication logs', 'blue');
    log('   • All login/register/logout events should be logged', 'blue');
    log('   • Errors and failures should also be logged', 'blue');
    separator();
    
  } catch (error) {
    log('\n💥 Test suite error:', 'red');
    log(error.message, 'red');
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/api/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
(async () => {
  log('\n🔍 Checking if server is running...', 'yellow');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('\n❌ Server is not running!', 'red');
    log('\n📝 Please start the server first:', 'yellow');
    log('   npm run dev', 'cyan');
    log('\n   Then run this test script again:', 'yellow');
    log('   node test-auth-logging.js', 'cyan');
    process.exit(1);
  }
  
  log('✅ Server is running!', 'green');
  
  await runTests();
})();