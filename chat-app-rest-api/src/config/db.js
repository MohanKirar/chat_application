const mongoose = require("mongoose");

/**
 * Establishes connection with MongoDB
 * This file is intentionally kept isolated
 * to make database configuration reusable,
 * testable, and environment.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true, // builds indexes automatically (dev friendly)
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit app if DB connection fails
  }
};

module.exports = connectDB;
