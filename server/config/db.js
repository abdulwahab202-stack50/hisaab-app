const mongoose = require('mongoose');

let isConnected = false;
const DEFAULT_MONGO_URI = 'mongodb+srv://antigravity_user:Antigravity123@cluster0.3k4ulaj.mongodb.net/hisab_app?retryWrites=true&w=majority';

const connectDB = async () => {
  // If connection is already open, reuse it (crucial for serverless lambdas)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
