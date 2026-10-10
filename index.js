const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.json());

bot.onText(/\/avs (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const lista = match[1].trim();

    bot.sendMessage(chatId, `🔍 **Tinitingnan ang card:** \`${lista}\` ...`, { parse_mode: 'Markdown' });

    try {
        const phpCheckerUrl = `https://yung-php-hosting-mo.com/checker.php?lista=${encodeURIComponent(lista)}`;
        
        const response = await axios.get(phpCheckerUrl);
        let resultText = response.data;

        let cleanMessage = resultText.replace(/<br\s*[\/]?>/gi, '\n');
        cleanMessage = cleanMessage.replace(/<[^>]*>?/gm, '');

        bot.sendMessage(chatId, cleanMessage.trim() || "Walang naging response mula sa server.", { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, `❌ **May error sa pag-request:** ${error.message}`, { parse_mode: 'Markdown' });
    }
});

app.get('/', (req, res) => {
    res.send('Telegram AVS Bot is active and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});