import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user-db"

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    console.log('Attempting to connect with URI:', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

export default connectDB