// Test Order #5 actual address parsing
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('  ORDER #5 ADDRESS PARSER TEST');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

const testAddress = "Flat 204, Sunny Residency,begumpet Hyderabaad, Telanganna - 500016";

console.log('📍 Input Address:', testAddress);
console.log('');

// Split by comma
const addressParts = testAddress.split(', ');
console.log('📍 Address Parts:', addressParts);
console.log('📍 Number of Parts:', addressParts.length);
console.log('');

// Parse according to the new logic
let pincode = '400001';
let state = 'Maharashtra';
let city = 'Mumbai';
let streetAddress = testAddress;

if (addressParts.length >= 3) {
  const lastPart = addressParts[addressParts.length - 1];
  
  if (lastPart.includes(' - ')) {
    const [statePart, pincodePart] = lastPart.split(' - ');
    state = statePart.trim();
    pincode = pincodePart.trim();
    
    // City is the second-to-last part
    const cityPart = addressParts[addressParts.length - 2]?.trim() || city;
    
    console.log('📍 City Part:', cityPart);
    
    // Extract city name from complex strings
    let streetParts = [];
    
    if (cityPart.includes(',')) {
      // Split by comma and take the last part as city
      const citySubParts = cityPart.split(',');
      const lastSubPart = citySubParts[citySubParts.length - 1].trim();
      
      console.log('📍 City Sub-Parts:', citySubParts);
      console.log('📍 Last Sub-Part:', lastSubPart);
      
      // Extract city name from "begumpet Hyderabaad" -> "Hyderabaad"
      const cityWords = lastSubPart.split(' ');
      if (cityWords.length >= 2) {
        city = cityWords[cityWords.length - 1]; // Last word is the city
        // Add the area/locality to street address
        const locality = cityWords.slice(0, -1).join(' ');
        if (locality) {
          streetParts.push(locality);
        }
      } else {
        city = lastSubPart;
      }
      
      // Add the parts before the city to street address
      const beforeCity = citySubParts.slice(0, -1).join(',');
      if (beforeCity) {
        streetParts.unshift(beforeCity);
      }
    } else {
      // No comma, try to extract city from space-separated words
      const cityWords = cityPart.split(' ');
      if (cityWords.length >= 2) {
        city = cityWords[cityWords.length - 1]; // Last word is the city
        // Add the area/locality to street address
        const locality = cityWords.slice(0, -1).join(' ');
        if (locality) {
          streetParts.push(locality);
        }
      } else {
        city = cityPart;
      }
    }
    
    // Street address is everything before the last 2 parts + extracted locality
    const baseStreet = addressParts.slice(0, addressParts.length - 2).join(', ').trim();
    if (baseStreet) {
      streetParts.unshift(baseStreet);
    }
    streetAddress = streetParts.join(', ') || testAddress;
    
    console.log('📍 Street Parts:', streetParts);
  }
}

// Clean pincode
pincode = pincode.replace(/\D/g, '');

// State corrections
const stateCorrections = {
  'telanganna': 'Telangana',
  'telangana': 'Telangana',
};

const stateLower = state.toLowerCase();
if (stateCorrections[stateLower]) {
  const originalState = state;
  state = stateCorrections[stateLower];
  console.log(`📍 Corrected state: "${originalState}" → "${state}"`);
}

// City corrections
const cityCorrections = {
  'hyderabaad': 'Hyderabad',
  'hyderabad': 'Hyderabad',
};

const cityLower = city.toLowerCase();
if (cityCorrections[cityLower]) {
  const originalCity = city;
  city = cityCorrections[cityLower];
  console.log(`📍 Corrected city: "${originalCity}" → "${city}"`);
}

console.log('');
console.log('📍 ========== PARSED RESULT ==========');
console.log('   - Street Address:', streetAddress);
console.log('   - City:', city);
console.log('   - State:', state);
console.log('   - Pincode:', pincode);
console.log('📍 ====================================');
console.log('');

// Expected result
console.log('✅ Expected Result:');
console.log('   - Street Address: Flat 204, Sunny Residency, begumpet');
console.log('   - City: Hyderabad');
console.log('   - State: Telangana');
console.log('   - Pincode: 500016');
console.log('');

// Check if it matches
const isCorrect = 
  streetAddress === 'Flat 204, Sunny Residency, begumpet' &&
  city === 'Hyderabad' &&
  state === 'Telangana' &&
  pincode === '500016';

if (isCorrect) {
  console.log('🎉 ✅ TEST PASSED! Address parser is working correctly!');
  console.log('');
  console.log('📦 What will be sent to Delhivery:');
  console.log('   {');
  console.log('     "address": "Flat 204, Sunny Residency, begumpet",');
  console.log('     "city": "Hyderabad",');
  console.log('     "state": "Telangana",');
  console.log('     "pin": "500016"');
  console.log('   }');
} else {
  console.log('❌ TEST FAILED! Address parser needs more work.');
  console.log('');
  console.log('Differences:');
  if (streetAddress !== 'Flat 204, Sunny Residency, begumpet') {
    console.log(`   ❌ Street: "${streetAddress}" vs "Flat 204, Sunny Residency, begumpet"`);
  }
  if (city !== 'Hyderabad') {
    console.log(`   ❌ City: "${city}" vs "Hyderabad"`);
  }
  if (state !== 'Telangana') {
    console.log(`   ❌ State: "${state}" vs "Telangana"`);
  }
  if (pincode !== '500016') {
    console.log(`   ❌ Pincode: "${pincode}" vs "500016"`);
  }
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('');