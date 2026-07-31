const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.enabled = this.botToken && this.channelId;
    
    if (this.enabled) {
      console.log('📱 Telegram Bot initialized (FREE!)');
      console.log(`📢 Channel: ${this.channelId}`);
    } else {
      console.log('⚠️ Telegram not configured. Check your .env file');
    }
  }

  async sendMessage(message, phoneNumbers = []) {
    if (!this.enabled) {
      return { success: false, error: 'Telegram not configured' };
    }

    try {
      // Format message with header
      const formattedMessage = `📢 <b>SCHOOL ANNOUNCEMENT</b>\n\n${message}\n\n━━━━━━━━━━━━━━━━━━━━\n📌 <i>Official school announcement</i>\n🏫 School Administration`;
      
      // Send to Telegram channel
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const response = await axios.post(url, {
        chat_id: this.channelId,
        text: formattedMessage,
        parse_mode: 'HTML',
        disable_notification: false
      });

      console.log('✅ Announcement sent to Telegram channel!');
      
      return {
        success: true,
        messageId: response.data.result?.message_id || 'telegram_' + Date.now(),
        status: 'sent'
      };
    } catch (error) {
      console.error('❌ Telegram error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendBulkSMS(phoneNumbers, message) {
    console.log(`📤 Sending to ${phoneNumbers.length} Telegram subscribers...`);
    
    // Send one message to channel - ALL members get it!
    const result = await this.sendMessage(message, phoneNumbers);
    
    // Return success for all recipients (they all get the message)
    return phoneNumbers.map(phone => ({
      phoneNumber: phone,
      success: result.success,
      messageId: result.messageId || 'telegram_' + Date.now(),
      status: result.success ? 'sent' : 'failed',
      method: 'telegram'
    }));
  }
}

module.exports = new TelegramService();