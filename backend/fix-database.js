const mongoose = require('mongoose');
require('dotenv').config();

// Define Section schema directly (since we might not have the model file)
const sectionSchema = new mongoose.Schema({
  name: String,
  grade: String,
  telegramChannel: String,
  adviser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-sms');
    console.log('✅ Connected to MongoDB');
    console.log('📊 Current sections:');

    // Show current data
    const currentSections = await Section.find({});
    console.log('\nCurrent data:');
    currentSections.forEach(s => {
      console.log(`  - ${s.name}: ${s.telegramChannel || 'No channel'}`);
    });

    // Update with correct channel names
    console.log('\n📝 Updating channel names...');
    
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

    // Verify the updates
    console.log('\n📊 Updated data:');
    const updatedSections = await Section.find({});
    updatedSections.forEach(s => {
      console.log(`  - ${s.name}: ${s.telegramChannel || 'No channel'}`);
    });

    console.log('\n✅ Database fixed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixDatabase();