const mongoose = require('mongoose');

const broadcastLogSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    },
    phoneNumbers: [String],
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'partial'],
      default: 'pending'
    }
  }],
  templateUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  totalRecipients: {
    type: Number,
    default: 0
  },
  sentCount: {
    type: Number,
    default: 0
  },
  failedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BroadcastLog', broadcastLogSchema);