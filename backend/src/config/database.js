const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_auth';

console.log('🔌 Attempting MongoDB connection...');

// Add demo mode flag
const isDemoMode = process.env.DEMO_MODE === 'true';

// Track connection state
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

const connectDB = async () => {
  // If in demo mode, skip database connection entirely
  if (isDemoMode) {
    console.log('🎯 Demo Mode: Skipping MongoDB connection');
    return;
  }

  // Limit connection attempts
  if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
    console.warn('⚠️ Maximum connection attempts reached. Running in demo mode.');
    process.env.DEMO_MODE = 'true';
    return;
  }

  try {
    connectionAttempts++;
    console.log(`🔄 Connection attempt ${connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduced timeout
      socketTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true
    });
    
    isConnected = true;
    console.log('✅ Connected to MongoDB');
    connectionAttempts = 0; // Reset on successful connection
  } catch (err) {
    console.warn(`⚠️ MongoDB connection attempt ${connectionAttempts} failed:`, err.message);
    
    // If this is the last attempt, enable demo mode
    if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.warn('🔄 Enabling demo mode due to persistent connection issues');
      process.env.DEMO_MODE = 'true';
    } else {
      // Retry with exponential backoff
      const retryDelay = Math.pow(2, connectionAttempts) * 1000;
      console.log(`⏳ Retrying in ${retryDelay/1000} seconds...`);
      setTimeout(connectDB, retryDelay);
    }
  }
};

// Only attempt connection if not in demo mode
if (!isDemoMode) {
  connectDB();
}

const db = mongoose.connection;

db.on('error', (err) => {
  console.warn('⚠️ MongoDB connection error:', err.message);
  isConnected = false;
});

db.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
  isConnected = false;
  
  // Attempt to reconnect if not in demo mode
  if (!isDemoMode && connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
    console.log('🔄 Attempting to reconnect...');
    setTimeout(connectDB, 5000);
  }
});

db.on('connected', () => {
  console.log('🔗 MongoDB connection established');
  isConnected = true;
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down MongoDB connection...');
  try {
    if (isConnected) {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
    }
  } catch (err) {
    console.error('❌ Error closing MongoDB connection:', err.message);
  }
  process.exit(0);
});

// Export connection status
module.exports = {
  mongoose,
  isConnected: () => isConnected,
  isDemoMode: () => isDemoMode
};