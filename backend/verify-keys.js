import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Verifying API Keys:\n');

// Check AssemblyAI
const assemblyKey = process.env.ASSEMBLYAI_API_KEY;
console.log('AssemblyAI Key:');
console.log('  Value:', assemblyKey);
console.log('  Status:', assemblyKey === '9bb19d851d154797bbbfffee494b9b10' ? '✅ CORRECT' : '❌ WRONG');

// Check Gemini
const geminiKey = process.env.GEMINI_API_KEY;
console.log('\nGemini Key:');
console.log('  Value:', geminiKey);
console.log('  Status:', geminiKey === 'AIzaSyDx1YmUF5RJ4A95USth9nyRPkEWkCjlbzI' ? '✅ CORRECT' : '❌ WRONG');

// Check MongoDB
console.log('\nMongoDB URI:');
console.log('  Value:', process.env.MONGODB_URI);
console.log('  Status:', process.env.MONGODB_URI ? '✅ SET' : '❌ MISSING');

console.log('\n' + '='.repeat(50));
if (
  assemblyKey === '9bb19d851d154797bbbfffee494b9b10' &&
  geminiKey === 'AIzaSyDx1YmUF5RJ4A95USth9nyRPkEWkCjlbzI'
) {
  console.log('✅ ALL KEYS ARE CORRECT! You can now upload audio.');
} else {
  console.log('❌ KEYS ARE INCORRECT! Check your .env file.');
}
