const axios = require('axios');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

console.log('📱 Testing Telegram Channels...');
console.log('🤖 Bot Token:', botToken ? '✅ Present' : '❌ Missing');
console.log('');

// 🔴 UPDATE THESE WITH YOUR ACTUAL CHANNEL NAMES
const channels = [
  { name: 'Bezos', id: '@Bezos_Section_2024' },      // <-- CHANGE THIS
  { name: 'Bacon', id: '@BaconUpdates' },      // <-- CHANGE THIS
  { name: 'Masadya', id: '@MasadyaUpdates' }   // <-- CHANGE THIS
];

async function testAllChannels() {
  let working = 0;
  
  for (const channel of channels) {
    console.log(`📤 Testing ${channel.name} (${channel.id})...`);
    
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          chat_id: channel.id,
          text: `✅ Test message for ${channel.name} at ${new Date().toLocaleTimeString()}`,
          parse_mode: 'HTML'
        }
      );
      
      console.log(`✅ ${channel.name} WORKING!`);
      working++;
      
    } catch (error) {
      console.log(`❌ ${channel.name} FAILED:`);
      console.log(`   ${error.response?.data?.description || error.message}`);
      
      if (error.response?.data?.description?.includes('chat not found')) {
        console.log(`   💡 Channel "${channel.id}" doesn't exist or name is wrong`);
        console.log(`   💡 Check the exact name in Telegram (case sensitive)`);
      }
      if (error.response?.data?.description?.includes('bot is not a member')) {
        console.log(`   💡 Add your bot as admin to ${channel.id}`);
      }
    }
    console.log('');
  }
  
  console.log(`📊 Summary: ${working}/${channels.length} channels working`);
  
  if (working === 0) {
    console.log('\n🔴 NONE of your channels are working!');
    console.log('Please check:');
    console.log('1. Did you create the channels in Telegram?');
    console.log('2. What are the EXACT channel names?');
    console.log('3. Did you add your bot as admin?');
  }
}

testAllChannels();