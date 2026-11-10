import mongoose from 'mongoose';

/**
 * Global cache across serverless function invocations & hot reloads.
 * Reuses database connection pool across Vercel serverless function invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MongoDB configuration error: MONGO_URI is not defined in environment variables.');
    return null;
  }

  // Reuse established connection pool if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection promise is not currently in-flight, initiate one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if connection drops rather than blocking queries
      maxPoolSize: 10,       // Maximize efficiency in serverless execution environments
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log(`✅ MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((err) => {
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        cached.promise = null; // Reset so subsequent requests can retry
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
