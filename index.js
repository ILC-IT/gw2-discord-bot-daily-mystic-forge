const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')
const axios = require('axios');
require('dotenv/config')

// API endpoint
const apiUrl = 'https://api.guildwars2.com/v2/achievements/daily';
// Channel ID
const idChannelTest = process.env.IDCHANNEL;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

// Function to send a notification embed message
const sendNotification = (channel) => {
    let h = new Date();
    let hoy = h.toLocaleDateString();
    // define embed notification
    const embed = new EmbedBuilder()
        .setTitle("GW2 Daily Mystic Forge!")
        .setDescription(`Today, ${hoy}, don't forget to use the mystic forge to win a mystic coin`)
        .setColor('Random')
    // send notification to channel    
    channel.send({embeds: [embed]});
};

// Function to check the API response
const checkApiResponse = async () => {
    try {
        const response = await axios.get(apiUrl);
        const apiResponse = response.data.pve;
        for (let i = 0; i < apiResponse.length; i++){
            if (apiResponse[i].id === 500){ // daily id mystic forge = 500
                const channel = client.channels.cache.get(idChannelTest);
                if (channel){
                    sendNotification(channel);
                }else{
                    console.error(`Channel ${idChannelTest} not found`);
                }
                
            }
        }
    } catch (error) {
        console.error('Error checking API response:', error);
    }
};

// Function to schedule the notification check, once per day at 6am
const scheduleNotification = () => {
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);  // 6 a.m.

    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilTarget = targetTime.getTime() - now.getTime();
    setTimeout(() => {
        checkApiResponse();
        setInterval(checkApiResponse, 24 * 60 * 60 * 1000); // Repeat every 24 hours
    }, timeUntilTarget);
};

// Event triggered when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    scheduleNotification();
});

// Login the bot
client.login(process.env.TOKEN)

//////
// client.on('messageCreate', message => {
//     if (message.content === 'ping'){
//         message.reply('pong')
//     }
// })