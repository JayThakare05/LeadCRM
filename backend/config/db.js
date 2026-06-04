const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Seeds the demo user account if it doesn't exist.
 */
const seedTestUser = async () => {
  try {
    const existing = await User.findOne({ username: 'test' });
    if (!existing) {
      await User.create({ username: 'test', password: 'test123' });
      console.log('Database Seed: Demo user "test" / "test123" created successfully.');
    }
  } catch (error) {
    console.error(`Database Seed Error: ${error.message}`);
  }
};

/**
 * Connects to MongoDB using the MONGO_URI from environment variables.
 * Exits the process with code 1 if connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    await seedTestUser();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
