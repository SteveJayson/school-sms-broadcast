const axios = require('axios');

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'mock';
    console.log(`📱 SMS Service initialized in ${this.provider.toUpperCase()} mode`);
    
    if (this.provider === 'telegram') {
      this.botToken = process.env.TELEGRAM_BOT_TOKEN;
      console.log('✅ Telegram Bot configured');
      if (!this.botToken) {
        console.log('⚠️  Bot token missing! Add TELEGRAM_BOT_TOKEN to .env');
      }
    }
  }

  async sendToChannel(channelId, message) {
    try {
      console.log(`📤 Sending to channel: ${channelId}`);
      
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: channelId,
        text: `📢 ${message}`,
        parse_mode: 'HTML'
      });

      console.log(`✅ Message sent to ${channelId}`);
      
      return {
        success: true,
        messageId: response.data.result?.message_id || 'telegram_' + Date.now(),
        status: 'sent'
      };
    } catch (error) {
      console.error(`❌ Telegram error for ${channelId}:`, error.response?.data || error.message);
      return {
        success: false,
        error: error.message,
        channel: channelId
      };
    }
  }

  async sendBroadcast(message, sections, recipientType) {
    const results = [];
    
    if (recipientType === 'all') {
      console.log(`📤 Sending to ALL ${sections.length} sections...`);
      for (const section of sections) {
        const channelId = section.telegramChannel;
        if (channelId) {
          console.log(`📤 Sending to ${section.name} (${channelId})`);
          const result = await this.sendToChannel(channelId, message);
          results.push({
            section: section.name,
            channel: channelId,
            success: result.success,
            messageId: result.messageId,
            error: result.error || null
          });
        } else {
          console.log(`⚠️  No Telegram channel for ${section.name}`);
          results.push({
            section: section.name,
            success: false,
            error: 'No Telegram channel configured'
          });
        }
      }
    } else if (sections && sections.length > 0) {
      console.log(`📤 Sending to ${sections.length} specific sections...`);
      for (const section of sections) {
        const channelId = section.telegramChannel;
        if (channelId) {
          console.log(`📤 Sending to ${section.name} (${channelId})`);
          const result = await this.sendToChannel(channelId, message);
          results.push({
            section: section.name,
            channel: channelId,
            success: result.success,
            messageId: result.messageId,
            error: result.error || null
          });
        } else {
          console.log(`⚠️  No Telegram channel for ${section.name}`);
          results.push({
            section: section.name,
            success: false,
            error: 'No Telegram channel configured'
          });
        }
      }
    }
    
    console.log(`📊 Results summary: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    return results;
  }

  async sendBulkSMS(phoneNumbers, message) {
    console.log('📤 Legacy sendBulkSMS called - use sendBroadcast instead');
    return phoneNumbers.map(phone => ({
      phoneNumber: phone,
      success: true,
      messageId: 'legacy_' + Date.now(),
      status: 'sent'
    }));
  }
}

module.exports = new SMSService();