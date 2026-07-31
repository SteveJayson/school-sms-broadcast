const app = require('./app');
const mongoose = require('mongoose');
const seedDatabase = require('./utils/seed');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-sms')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Seed database with initial data
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });