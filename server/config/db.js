import { connect } from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MongoDB configuration error: MONGO_URI is not defined in environment variables.');
    return;
  }

  try {
    const conn = await connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️ Running in disconnected mode. MongoDB operations will retry on demand.');
  }
};

export default connectDB;
