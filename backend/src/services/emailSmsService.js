const nodemailer = require('nodemailer');

class EmailSMSService {
  constructor() {
    console.log('📱 SMS via Email Service initialized (FREE!)');
  }

  async sendSingleSMS(phoneNumber, message) {
    try {
      // Clean phone number
      let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
      
      // Determine carrier from phone number
      const carrier = this.detectCarrier(cleanNumber);
      const email = `${cleanNumber}@${carrier}`;
      
      console.log(`📤 Sending via email to ${phoneNumber} (${carrier})`);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@gmail.com', // Your Gmail
          pass: 'your-app-password'      // Gmail App Password
        }
      });

      await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'School Announcement',
        text: message
      });

      console.log(`✅ SMS sent to ${phoneNumber} via email`);
      return {
        success: true,
        phoneNumber,
        carrier
      };
    } catch (error) {
      console.error(`❌ Failed to send to ${phoneNumber}:`, error.message);
      return {
        success: false,
        error: error.message,
        phoneNumber
      };
    }
  }

  detectCarrier(phoneNumber) {
    // Philippine carrier prefixes
    const prefixes = {
      '0917': 'txt.globe.com.ph',  // Globe
      '0918': 'txt.globe.com.ph',
      '0915': 'txt.globe.com.ph',
      '0926': 'txt.globe.com.ph',
      '0927': 'txt.globe.com.ph',
      '0905': 'txt.globe.com.ph',
      '0906': 'txt.globe.com.ph',
      '0910': 'smart.com.ph',      // Smart
      '0911': 'smart.com.ph',
      '0912': 'smart.com.ph',
      '0913': 'smart.com.ph',
      '0914': 'smart.com.ph',
      '0916': 'smart.com.ph',
      '0919': 'smart.com.ph',
      '0920': 'smart.com.ph',
      '0921': 'smart.com.ph',
      '0922': 'smart.com.ph',
      '0923': 'smart.com.ph',
      '0924': 'smart.com.ph',
      '0925': 'smart.com.ph',
      '0928': 'smart.com.ph',
      '0929': 'smart.com.ph',
      '0930': 'smart.com.ph',
      '0931': 'smart.com.ph',
      '0932': 'smart.com.ph',
      '0933': 'smart.com.ph',
      '0934': 'smart.com.ph',
      '0935': 'smart.com.ph',
      '0936': 'smart.com.ph',
      '0937': 'smart.com.ph',
      '0938': 'smart.com.ph',
      '0939': 'smart.com.ph',
      '0940': 'smart.com.ph',
      '0941': 'smart.com.ph',
      '0942': 'smart.com.ph',
      '0943': 'smart.com.ph',
      '0944': 'smart.com.ph',
      '0945': 'smart.com.ph',
      '0946': 'smart.com.ph',
      '0947': 'smart.com.ph',
      '0948': 'smart.com.ph',
      '0949': 'smart.com.ph',
      '0950': 'smart.com.ph',
      '0951': 'smart.com.ph',
      '0952': 'smart.com.ph',
      '0953': 'smart.com.ph',
      '0954': 'smart.com.ph',
      '0955': 'smart.com.ph',
      '0956': 'smart.com.ph',
      '0957': 'smart.com.ph',
      '0958': 'smart.com.ph',
      '0959': 'smart.com.ph'
    };

    // Get first 4 digits of phone number
    const prefix = phoneNumber.substring(0, 4);
    return prefixes[prefix] || 'txt.globe.com.ph'; // Default to Globe
  }

  async sendBulkSMS(phoneNumbers, message) {
    console.log(`📤 Sending bulk SMS to ${phoneNumbers.length} recipients via email`);
    
    const results = [];
    for (const phone of phoneNumbers) {
      const result = await this.sendSingleSMS(phone, message);
      results.push(result);
      // Delay to avoid spam filters
      await this.delay(500);
    }
    
    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new EmailSMSService();