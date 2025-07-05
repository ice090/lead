import TelegramBot from 'node-telegram-bot-api';

let bot = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;

  // Parse JSON manually if needed (Vercel quirk)
  if (!body || typeof body !== 'object') {
    try {
      const rawBody = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
        req.on('error', err => reject(err));
      });

      body = JSON.parse(rawBody);
    } catch (err) {
      console.error('Error parsing body:', err);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { name, email, userAgent } = body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  if (!bot) {
    if (!process.env.BOT_TOKEN) {
      console.error("BOT_TOKEN is missing");
      return res.status(500).json({ error: 'BOT_TOKEN is not defined in env' });
    }

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
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram sendMessage error:', err);
    return res.status(500).json({ error: 'Telegram failed' });
  }
}
