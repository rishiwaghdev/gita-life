const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_DEFAULT_CHAT_ID = process.env.TELEGRAM_DEFAULT_CHAT_ID;

const sendMessage = async ({ chatId, text }) => {
  const resolvedChatId = chatId || TELEGRAM_DEFAULT_CHAT_ID;

  if (!resolvedChatId) {
    throw new Error('Telegram chat ID is required. Add TELEGRAM_DEFAULT_CHAT_ID or enter a chat ID before sending.');
  }
  if (!text) {
    throw new Error('Telegram message text is required');
  }

  if (!TELEGRAM_BOT_TOKEN) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }

    console.log(`[Mock Telegram] To: ${resolvedChatId} | Message: ${text}`);
    return { success: true, provider: 'mock' };
  }

  const response = await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      chat_id: resolvedChatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

module.exports = {
  sendMessage,
};
