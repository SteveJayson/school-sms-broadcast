const BroadcastLog = require('../models/BroadcastLog');
const Section = require('../models/Section');
const Template = require('../models/Template');
const smsService = require('../services/smsService');

exports.sendBroadcast = async (req, res) => {
  try {
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

    let phoneNumbers = [];

    if (recipientType === 'all') {
      const allSections = await Section.find({ isActive: true });
      allSections.forEach(section => {
        phoneNumbers = [...phoneNumbers, ...section.phoneNumbers];
      });
    } else if (sections && sections.length > 0) {
      const selectedSections = await Section.find({ 
        _id: { $in: sections },
        isActive: true 
      });
      selectedSections.forEach(section => {
        phoneNumbers = [...phoneNumbers, ...section.phoneNumbers];
      });
    } else {
      return res.status(400).json({ 
        message: 'No recipients specified' 
      });
    }

    phoneNumbers = [...new Set(phoneNumbers)];

    if (phoneNumbers.length === 0) {
      return res.status(400).json({ 
        message: 'No phone numbers found for selected sections' 
      });
    }

    const broadcastLog = new BroadcastLog({
      message: finalMessage,
      sender: req.userId || 'test_user_id',
      recipients: sections?.map(sectionId => ({
        section: sectionId,
        phoneNumbers: [],
        status: 'pending'
      })) || [],
      templateUsed: templateId || null,
      totalRecipients: phoneNumbers.length,
      status: 'pending'
    });

    await broadcastLog.save();

    // Send SMS using the service
    const results = await smsService.sendBulkSMS(phoneNumbers, finalMessage);

    const sentCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

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
      total: phoneNumbers.length
    });

  } catch (error) {
    console.error('Broadcast error:', error);
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
    res.status(500).json({ message: 'Failed to fetch broadcast history', error: error.message });
  }
};

exports.checkBalance = async (req, res) => {
  res.json({
    provider: process.env.SMS_PROVIDER || 'mock',
    message: 'Balance check not available in mock mode',
    balance: '∞'
  });
};