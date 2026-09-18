const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ WARNING: MONGO_URI environment variable is not defined.');
    return null;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tip for Render/Atlas: Ensure MongoDB Atlas Network Access whitelist has 0.0.0.0/0 (Allow access from anywhere).');
    return null;
  }
};

module.exports = connectDB;