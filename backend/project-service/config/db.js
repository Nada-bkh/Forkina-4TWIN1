// config/db.js
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://mongo:27017/project-db';

mongoose.set('strictQuery', true);

const connectDB = async () => {
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

module.exports = connectDB;
