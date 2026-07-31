const mongoose = require('mongoose');
require('dotenv').config();
const Section = require('./src/models/Section');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function seedSections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-sms');
    console.log('✅ Connected to MongoDB');

    // Clear existing sections
    await Section.deleteMany({});
    console.log('🗑️  Removed old sections');

    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: 'admin@school.com' });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = new User({
        email: 'admin@school.com',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created');
    }

    // Create your 3 sections
    const sections = [
      {
        name: 'Bezos',
        grade: 'Grade 7',
        telegramChannel: '@BezosUpdates',
        adviser: admin._id,
        isActive: true
      },
      {
        name: 'Bacon',
        grade: 'Grade 8',
        telegramChannel: '@BaconUpdates',
        adviser: admin._id,
        isActive: true
      },
      {
        name: 'Masadya',
        grade: 'Grade 9',
        telegramChannel: '@MasadyaUpdates',
        adviser: admin._id,
        isActive: true
      }
    ];

    await Section.insertMany(sections);
    console.log('\n✅ 3 Sections created:');
    sections.forEach(s => console.log(`  📚 ${s.name} → ${s.telegramChannel}`));

    console.log('\n📊 Database ready!');
    console.log('👤 Admin Login:');
    console.log('   Email: admin@school.com');
    console.log('   Password: admin123');
    console.log('\n📢 Create these Telegram channels:');
    sections.forEach(s => console.log(`   - ${s.telegramChannel}`));
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedSections();