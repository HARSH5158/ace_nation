const mongoose = require('mongoose');

// Test MongoDB connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    const conn = await mongoose.connect('mongodb+srv://jainmanthan6106:jain1234@ace-nation.9xpfamo.mongodb.net/?retryWrites=true&w=majority&appName=ACE-NATION', {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Test database operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections in database:', collections.map(c => c.name));
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}

testConnection();
