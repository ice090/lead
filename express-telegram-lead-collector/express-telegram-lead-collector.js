const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot setup - Replace 'YOUR_BOT_TOKEN' with your actual bot token
const botToken = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(botToken, { polling: true });

// Replace with your Telegram chat ID where leads will be sent
const chatId = process.env.CHAT_ID || '7638934385';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit-lead', (req, res) => {
  const { name, email, userAgent } = req.body;

  // Validate form data
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  // Format the lead message
  const leadMessage = `
New Lead Received:
Name: ${name}
Email: ${email}
User Agent: ${userAgent || 'Not provided'}
Timestamp: ${new Date().toLocaleString()}
`;

  // Send message to Telegram
  bot.sendMessage(chatId, leadMessage)
    .then(() => {
      res.send('Lead submitted successfully! We will contact you soon.');
    })
    .catch((error) => {
      console.error('Error sending to Telegram:', error);
      res.status(500).send('Error submitting lead');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Telegram bot confirmation
bot.on('message', (msg) => {
  console.log(`Bot received message from ${msg.chat.id}: ${msg.text}`);
});
