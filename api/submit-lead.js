// api/submit-lead.js
const TelegramBot = require('node-telegram-bot-api');

let bot;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, userAgent } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!bot) {
    bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });
  }

  const message = `
New Lead Received:
Name: ${name}
Email: ${email}
User Agent: ${userAgent || 'Not provided'}
Timestamp: ${new Date().toLocaleString()}
  `;

  try {
    await bot.sendMessage(process.env.CHAT_ID, message);
    return res.status(200).json({ success: true, message: 'Lead submitted successfully' });
  } catch (err) {
    console.error('Telegram Error:', err);
    return res.status(500).json({ error: 'Error sending to Telegram' });
  }
}
