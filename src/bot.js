require('node:dotenv/config');

const { reminderbotBot } = require('./index.js');

const bot = new reminderbotBot({
 token: process.env.BOT_TOKEN,
 debug: process.env.DEBUG === 'true'
});

bot.onCommand('ping', (msg) => console.log('pong', msg.id));
bot.onCommand('status', (msg) => console.log('status ok at', msg.at));

bot.on('error', (err) => console.error(err.message));
bot.start();