const mongoose = require('mongoose');
require('dotenv').config();
const Section = require('./src/models/Section');

async function updateChannels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-sms');
    console.log('✅ Connected to MongoDB');

    // Update with your working channel names
    const updates = [
      { name: 'Bezos', channel: '@Bezos_Section' },
      { name: 'Bacon', channel: '@Bacon_Section' },
      { name: 'Masadya', channel: '@Masadya_Section' }
    ];

    for (const update of updates) {
      const section = await Section.findOne({ name: update.name });
      if (section) {
        section.telegramChannel = update.channel;
        await section.save();
        console.log(`✅ Updated ${update.name} → ${update.channel}`);
      } else {
        console.log(`❌ Section not found: ${update.name}`);
      }
    }

    console.log('\n✅ All sections updated!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateChannels();