const axios = require('axios');
require('dotenv').config();

// Get credentials from .env
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

console.log('📱 Testing Telegram Bot...');
console.log('🤖 Bot Token:', botToken ? botToken.substring(0, 15) + '...' : '❌ MISSING');
console.log('📢 Channel ID:', channelId || '❌ MISSING');

if (!botToken || !channelId) {
  console.error('\n❌ Missing Telegram credentials in .env file');
  console.log('\nPlease add to backend/.env:');
  console.log('TELEGRAM_BOT_TOKEN=your_bot_token_here');
  console.log('TELEGRAM_CHANNEL_ID=@SchoolAnnouncement');
  process.exit(1);
}

async function testTelegram() {
  try {
    console.log('\n📤 Sending test message to Telegram...');
    
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: channelId,
        text: '✅ <b>Telegram Test Success!</b>\n\nThis is a test message from the School SMS Broadcast System.\n\nIf you see this, Telegram integration is working! 🎉',
        parse_mode: 'HTML'
      }
    );

    console.log('\n✅ SUCCESS! Message sent to Telegram!');
    console.log('📨 Message ID:', response.data.result?.message_id);
    console.log('📅 Sent at:', new Date().toLocaleString());
    console.log('\n📱 Check your Telegram channel to see the message!');
    
  } catch (error) {
    console.error('\n❌ ERROR sending to Telegram:');
    console.error(error.response?.data?.description || error.message);
    
    if (error.response?.data?.description) {
      const desc = error.response.data.description;
      
      if (desc.includes('bot is not a member')) {
        console.log('\n🔧 FIX: Add your bot as admin to the channel!');
        console.log('1. Go to your Telegram channel');
        console.log('2. Tap channel name → Administrators → Add Admin');
        console.log(`3. Search for: ${process.env.TELEGRAM_BOT_USERNAME || 'your bot'}`);
        console.log('4. Enable "Post Messages"');
      } else if (desc.includes('chat not found')) {
        console.log('\n🔧 FIX: Check your channel ID!');
        console.log('For public channels, use: @channelusername');
        console.log('Example: @SchoolAnnouncement');
      } else if (desc.includes('wrong token')) {
        console.log('\n🔧 FIX: Your bot token is invalid!');
        console.log('Get a new token from @BotFather:');
        console.log('1. Go to @BotFather');
        console.log('2. Type: /token');
        console.log('3. Select your bot');
        console.log('4. Copy the new token');
      }
    }
  }
}

testTelegram();