const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Section = require('../models/Section');
const Template = require('../models/Template');

const seedDatabase = async () => {
  try {
    // Create admin user
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

    // Create sections
    const sectionsCount = await Section.countDocuments();
    if (sectionsCount === 0) {
      const sections = [
        {
          name: 'Bezos',
          grade: 'Grade 7',
          telegramChannel: '@BezosUpdates',
          adviser: admin._id
        },
        {
          name: 'Bacon',
          grade: 'Grade 8',
          telegramChannel: '@BaconUpdates',
          adviser: admin._id
        },
        {
          name: 'Masadya',
          grade: 'Grade 9',
          telegramChannel: '@MasadyaUpdates',
          adviser: admin._id
        }
      ];
      await Section.insertMany(sections);
      console.log('✅ Sections created: Bezos, Bacon, Masadya');
    }

    // Create templates
    const templatesCount = await Template.countDocuments();
    if (templatesCount === 0) {
      const templates = [
        {
          name: 'No Classes',
          content: 'Dear Parents/Guardians,\n\nPlease be informed that there will be NO CLASSES on [DATE] due to [REASON].\n\nStay safe and take care.\n\nRegards,\nSchool Administration',
          category: 'academic',
          createdBy: admin._id
        },
        {
          name: 'Suspension of Classes',
          content: 'ATTENTION: Students, Parents, and Staff\n\nClasses are SUSPENDED on [DATE] due to [WEATHER CONDITION].\n\nPlease stay indoors and monitor official announcements.\n\nSchool Administration',
          category: 'emergency',
          createdBy: admin._id
        }
      ];
      await Template.insertMany(templates);
      console.log('✅ Templates created');
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedDatabase;