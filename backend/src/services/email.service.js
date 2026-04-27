const axios = require('axios');

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;

const getAccessToken = async () => {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    throw new Error('Gmail OAuth env vars are missing');
  }

  const payload = new URLSearchParams({
    client_id: GMAIL_CLIENT_ID,
    client_secret: GMAIL_CLIENT_SECRET,
    refresh_token: GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const response = await axios.post('https://oauth2.googleapis.com/token', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
};

const toBase64Url = (input) =>
  Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const sendEmail = async ({ to, subject, text }) => {
  if (!to || !subject || !text) {
    throw new Error('Email to, subject and text are required');
  }

  if (!GMAIL_SENDER_EMAIL || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.log(`[Mock Gmail] To: ${to} | Subject: ${subject} | Body: ${text}`);
    return { success: true, provider: 'mock' };
  }

  const accessToken = await getAccessToken();
  const mimeMessage = [
    `From: Gita Life Program <${GMAIL_SENDER_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
  ].join('\r\n');

  const raw = toBase64Url(mimeMessage);

  const response = await axios.post(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    { raw },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

module.exports = {
  sendEmail,
};
