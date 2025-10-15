import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...\n');
console.log('URI:', process.env.MONGODB_URI);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected Successfully!');
  
  // Test creating a document
  const TestSchema = new mongoose.Schema({
    name: String,
  });
  const TestModel = mongoose.model('Test', TestSchema);
  
  const doc = await TestModel.create({ name: 'Test' });
  console.log('✅ Test document created:', doc._id);
  
  await TestModel.deleteOne({ _id: doc._id });
  console.log('✅ Test document deleted');
  
  await mongoose.disconnect();
  console.log('✅ Disconnected');
} catch (error) {
  console.error('❌ MongoDB Error:', error.message);
}
