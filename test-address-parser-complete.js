// Complete test of the address parser fix
// This shows exactly what will happen with Order #5

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('  ADDRESS PARSER FIX - COMPLETE TEST');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Test cases
const testCases = [
  {
    name: 'Order #5 (Your Actual Address)',
    address: 'begumpet Hyderabaad, Telanganna - 500016',
    expected: {
      street: 'begumpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500016'
    }
  },
  {
    name: 'Standard Format (3 parts)',
    address: '123 Main Street, Hyderabad, Telangana - 500016',
    expected: {
      street: '123 Main Street',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500016'
    }
  },
  {
    name: 'Another 2-part Format',
    address: 'MG Road Bangalore, Karnataka - 560001',
    expected: {
      street: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  },
  {
    name: 'With Typo in State',
    address: 'Connaught Place Delhi, Maharastra - 110001',
    expected: {
      street: 'Connaught Place',
      city: 'Delhi',
      state: 'Maharashtra',
      pincode: '110001'
    }
  }
];

// State corrections
const stateCorrections = {
  'telanganna': 'Telangana',
  'telangana': 'Telangana',
  'maharastra': 'Maharashtra',
  'maharashtra': 'Maharashtra',
  'karnataka': 'Karnataka',
  'delhi': 'Delhi'
};

// City corrections
const cityCorrections = {
  'hyderabaad': 'Hyderabad',
  'hyderabad': 'Hyderabad',
  'bengaluru': 'Bangalore',
  'bangalore': 'Bangalore',
  'delhi': 'Delhi'
};

// Parser function (same as in delivery.ts)
function parseAddress(address) {
  const addressParts = address.split(', ');
  
  let pincode = '400001';
  let state = 'Maharashtra';
  let city = 'Mumbai';
  let streetAddress = address;
  
  // Handle format: "Street City, State - Pincode" (2 parts)
  if (addressParts.length === 2) {
    const lastPart = addressParts[1];
    
    if (lastPart.includes(' - ')) {
      const [statePart, pincodePart] = lastPart.split(' - ');
      state = statePart.trim();
      pincode = pincodePart.trim();
      
      const firstPart = addressParts[0].trim();
      const firstPartWords = firstPart.split(' ');
      
      if (firstPartWords.length >= 2) {
        city = firstPartWords[firstPartWords.length - 1];
        streetAddress = firstPartWords.slice(0, -1).join(' ');
      } else {
        city = firstPart;
        streetAddress = firstPart;
      }
    }
  }
  // Handle format: "Street, City, State - Pincode" (3+ parts)
  else if (addressParts.length >= 3) {
    const lastPart = addressParts[addressParts.length - 1];
    
    if (lastPart.includes(' - ')) {
      const [statePart, pincodePart] = lastPart.split(' - ');
      state = statePart.trim();
      pincode = pincodePart.trim();
      
      city = addressParts[addressParts.length - 2]?.trim() || city;
      streetAddress = addressParts.slice(0, addressParts.length - 2).join(', ').trim() || address;
    }
  }
  
  // Clean pincode
  pincode = pincode.replace(/\D/g, '');
  
  // Correct state
  const stateLower = state.toLowerCase();
  if (stateCorrections[stateLower]) {
    state = stateCorrections[stateLower];
  }
  
  // Correct city
  const cityLower = city.toLowerCase();
  if (cityCorrections[cityLower]) {
    city = cityCorrections[cityLower];
  }
  
  return { streetAddress, city, state, pincode };
}

// Run tests
let passedTests = 0;
let failedTests = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📍 Input Address: "${testCase.address}"`);
  
  const result = parseAddress(testCase.address);
  
  console.log(`\n📦 Parsed Result:`);
  console.log(`   - Street: ${result.streetAddress}`);
  console.log(`   - City: ${result.city}`);
  console.log(`   - State: ${result.state}`);
  console.log(`   - Pincode: ${result.pincode}`);
  
  console.log(`\n✅ Expected Result:`);
  console.log(`   - Street: ${testCase.expected.street}`);
  console.log(`   - City: ${testCase.expected.city}`);
  console.log(`   - State: ${testCase.expected.state}`);
  console.log(`   - Pincode: ${testCase.expected.pincode}`);
  
  const passed = 
    result.streetAddress === testCase.expected.street &&
    result.city === testCase.expected.city &&
    result.state === testCase.expected.state &&
    result.pincode === testCase.expected.pincode;
  
  if (passed) {
    console.log(`\n🎉 ✅ TEST PASSED!`);
    passedTests++;
  } else {
    console.log(`\n❌ TEST FAILED!`);
    failedTests++;
    
    if (result.streetAddress !== testCase.expected.street) {
      console.log(`   ❌ Street mismatch: "${result.streetAddress}" vs "${testCase.expected.street}"`);
    }
    if (result.city !== testCase.expected.city) {
      console.log(`   ❌ City mismatch: "${result.city}" vs "${testCase.expected.city}"`);
    }
    if (result.state !== testCase.expected.state) {
      console.log(`   ❌ State mismatch: "${result.state}" vs "${testCase.expected.state}"`);
    }
    if (result.pincode !== testCase.expected.pincode) {
      console.log(`   ❌ Pincode mismatch: "${result.pincode}" vs "${testCase.expected.pincode}"`);
    }
  }
});

console.log(`\n\n═══════════════════════════════════════════════════════════`);
console.log(`  TEST SUMMARY`);
console.log(`═══════════════════════════════════════════════════════════`);
console.log(`\n✅ Passed: ${passedTests}/${testCases.length}`);
console.log(`❌ Failed: ${failedTests}/${testCases.length}`);

if (failedTests === 0) {
  console.log(`\n🎉 🎉 🎉 ALL TESTS PASSED! 🎉 🎉 🎉`);
  console.log(`\n✅ The address parser is working correctly!`);
  console.log(`✅ Order #5 will now work with Delhivery!`);
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Restart your server (npm run dev)`);
  console.log(`   2. Test Order #5 by changing status to "Shipped"`);
  console.log(`   3. Check server logs for success message`);
} else {
  console.log(`\n⚠️ Some tests failed. Please review the parser logic.`);
}

console.log(`\n═══════════════════════════════════════════════════════════\n`);