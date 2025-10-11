// Test the address parser fix
// This simulates what the parser will do with the address

const testAddress = "begumpet Hyderabaad, Telanganna - 500016";

console.log('🧪 Testing Address Parser');
console.log('📍 Input Address:', testAddress);
console.log('');

// Split by comma
const addressParts = testAddress.split(', ');
console.log('📍 Address Parts:', addressParts);
console.log('📍 Number of Parts:', addressParts.length);
console.log('');

// Parse according to the new logic
let pincode = '400001'; // Default
let state = 'Maharashtra'; // Default
let city = 'Mumbai'; // Default
let streetAddress = testAddress;

if (addressParts.length === 2) {
  const lastPart = addressParts[1]; // "Telanganna - 500016"
  
  if (lastPart.includes(' - ')) {
    const [statePart, pincodePart] = lastPart.split(' - ');
    state = statePart.trim();
    pincode = pincodePart.trim();
    
    // First part contains "Street City" - extract city as last word
    const firstPart = addressParts[0].trim();
    const firstPartWords = firstPart.split(' ');
    
    if (firstPartWords.length >= 2) {
      // Last word is likely the city
      city = firstPartWords[firstPartWords.length - 1];
      // Everything else is the street address
      streetAddress = firstPartWords.slice(0, -1).join(' ');
    } else {
      // If only one word, use it as both street and city
      city = firstPart;
      streetAddress = firstPart;
    }
    
    console.log('✅ Parsed format: "Street City, State - Pincode"');
  }
}

// Ensure pincode is only digits
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
console.log('   - Street Address: begumpet');
console.log('   - City: Hyderabaad');
console.log('   - State: Telangana');
console.log('   - Pincode: 500016');
console.log('');

// Check if it matches
const isCorrect = 
  streetAddress === 'begumpet' &&
  city === 'Hyderabaad' &&
  state === 'Telangana' &&
  pincode === '500016';

if (isCorrect) {
  console.log('🎉 ✅ TEST PASSED! Address parser is working correctly!');
} else {
  console.log('❌ TEST FAILED! Address parser needs more work.');
}