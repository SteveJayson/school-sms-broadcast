const axios = require('axios');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

console.log('🤖 Getting Telegram Channel IDs...');
console.log('ℹ️  Make sure your bot is an admin in the channel');

// List your channels - UPDATE THESE WITH YOUR CHANNEL NAMES
const channels = [
  '@Bezos Updates',     // Change to your actual channel
  '@BaconUpdates',     // Change to your actual channel
  '@MasadyaUpdates'    // Change to your actual channel
];

async function getChannelIds() {
  for (const channel of channels) {
    console.log(`\n📢 Getting ID for: ${channel}`);
    
    try {
      // Method 1: Get chat info
      const response = await axios.get(
        `https://api.telegram.org/bot${botToken}/getChat`,
        {
          params: { chat_id: channel }
        }
      );
      
      console.log(`✅ Channel: ${response.data.result.title}`);
      console.log(`📌 Numeric ID: ${response.data.result.id}`);
      console.log(`🔗 Username: ${response.data.result.username || 'None'}`);
      
    } catch (error) {
      console.log(`❌ Error getting ID for ${channel}:`);
      console.log(`   ${error.response?.data?.description || error.message}`);
      console.log(`\n💡 Make sure:`);
      console.log(`   1. The channel exists`);
      console.log(`   2. Your bot is an admin in the channel`);
      console.log(`   3. The channel name is correct (case sensitive)`);
    }
  }
  
  console.log('\n✅ Done!');
  console.log('\n📝 Copy these IDs to your database:');
  console.log('----------------------------------------');
}

getChannelIds();