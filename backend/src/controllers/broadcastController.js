const BroadcastLog = require('../models/BroadcastLog');
const Section = require('../models/Section');
const Template = require('../models/Template');
const User = require('../models/User');
const smsService = require('../services/smsService');

exports.sendBroadcast = async (req, res) => {
  try {
    console.log('📨 Received broadcast request:', req.body);
    
    const { message, sections, templateId, recipientType } = req.body;

    if (!message && !templateId) {
      return res.status(400).json({ 
        message: 'Either message or template is required' 
      });
    }

    let finalMessage = message;
    let templateUsed = null;

    if (templateId) {
      templateUsed = await Template.findById(templateId);
      if (!templateUsed) {
        return res.status(404).json({ message: 'Template not found' });
      }
      finalMessage = templateUsed.content;
    }

    let selectedSections = [];

    if (recipientType === 'all') {
      selectedSections = await Section.find({ isActive: true });
    } else if (sections && sections.length > 0) {
      selectedSections = await Section.find({ 
        _id: { $in: sections },
        isActive: true 
      });
    } else {
      return res.status(400).json({ 
        message: 'No recipients specified' 
      });
    }

    if (selectedSections.length === 0) {
      return res.status(400).json({ 
        message: 'No sections found' 
      });
    }

    console.log(`📤 Sending to ${selectedSections.length} sections`);

    // Get sender ID
    let senderId = req.userId;
    if (!senderId || senderId === 'test_user_id') {
      const adminUser = await User.findOne({ email: 'admin@school.com' });
      if (adminUser) {
        senderId = adminUser._id;
      } else {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const newAdmin = new User({
          email: 'admin@school.com',
          password: hashedPassword,
          name: 'System Administrator',
          role: 'admin'
        });
        await newAdmin.save();
        senderId = newAdmin._id;
        console.log('✅ Created new admin user for broadcast');
      }
    }

    // Create broadcast log
    const broadcastLog = new BroadcastLog({
      message: finalMessage,
      sender: senderId,
      recipients: selectedSections.map(section => ({
        section: section._id,
        phoneNumbers: [],
        status: 'pending'
      })),
      templateUsed: templateId || null,
      totalRecipients: selectedSections.length,
      status: 'pending'
    });

    await broadcastLog.save();

    // Send to Telegram channels
    console.log('📤 Sending to Telegram channels...');
    const results = await smsService.sendBroadcast(
      finalMessage,
      selectedSections,
      recipientType
    );

    console.log('📊 Results:', JSON.stringify(results, null, 2));

    // Count successes and failures
    const sentCount = results.filter(r => r.success === true).length;
    const failedCount = results.filter(r => r.success === false).length;

    console.log(`📊 Sent: ${sentCount}, Failed: ${failedCount}`);

    broadcastLog.sentCount = sentCount;
    broadcastLog.failedCount = failedCount;
    broadcastLog.status = failedCount > 0 && sentCount > 0 ? 'partial' : 
                          sentCount > 0 ? 'completed' : 'failed';
    broadcastLog.sentAt = new Date();

    await broadcastLog.save();

    if (templateId) {
      await Template.findByIdAndUpdate(templateId, {
        $inc: { usageCount: 1 }
      });
    }

    res.status(200).json({
      message: 'Broadcast sent successfully',
      broadcastId: broadcastLog._id,
      sent: sentCount,
      failed: failedCount,
      total: selectedSections.length,
      details: results
    });

  } catch (error) {
    console.error('❌ Broadcast error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to send broadcast', 
      error: error.message 
    });
  }
};

exports.getBroadcastHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const broadcasts = await BroadcastLog.find({ sender: req.userId || 'test_user_id' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('templateUsed', 'name')
      .populate('sender', 'name email');

    const total = await BroadcastLog.countDocuments({ sender: req.userId || 'test_user_id' });

    res.json({
      broadcasts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ History error:', error);
    res.status(500).json({ message: 'Failed to fetch broadcast history', error: error.message });
  }
};

exports.checkBalance = async (req, res) => {
  res.json({
    provider: process.env.SMS_PROVIDER || 'mock',
    message: 'Balance check not available',
    balance: '∞'
  });
};