import mongoose from 'mongoose';

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB as string, {});
    console.info('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

export default connectToMongoDB;
