const axios = require('axios');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // example: whatsapp:+14155238886
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '+91';

const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    return digits ? `+${digits}` : '';
  }

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return `${DEFAULT_COUNTRY_CODE}${digits}`;
};

const formatWhatsAppAddress = (phone) => {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';
  return normalized.startsWith('whatsapp:') ? normalized : `whatsapp:${normalized}`;
};

const sendViaTwilio = async (payload) => {
  const response = await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    new URLSearchParams(payload),
    {
      auth: {
        username: TWILIO_ACCOUNT_SID,
        password: TWILIO_AUTH_TOKEN,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};

const getTwilioTemplateSid = (templateName) => {
  const key = `TWILIO_WHATSAPP_TEMPLATE_${String(templateName || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')}`;
  return process.env[key];
};

const sendTemplateMessage = async (to, templateName, languageCode = 'en_US') => {
  const toAddress = formatWhatsAppAddress(to);
  if (!toAddress) {
    throw new Error('Valid recipient phone number is required');
  }
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.log(`[Mock Twilio WhatsApp] Sending template ${templateName} (${languageCode}) to ${toAddress || to}`);
    return true;
  }

  try {
    const contentSid = getTwilioTemplateSid(templateName);
    if (contentSid) {
      return await sendViaTwilio({
        From: TWILIO_WHATSAPP_FROM,
        To: toAddress,
        ContentSid: contentSid,
      });
    }

    const fallbackBody = `Reminder from Gita Life Program.`;
    return await sendViaTwilio({
      From: TWILIO_WHATSAPP_FROM,
      To: toAddress,
      Body: fallbackBody,
    });
  } catch (error) {
    console.error('Error sending Twilio WhatsApp template message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const sendTextMessage = async (to, message) => {
  const toAddress = formatWhatsAppAddress(to);
  if (!toAddress) {
    throw new Error('Valid recipient phone number is required');
  }
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    console.log(`[Mock Twilio WhatsApp] Sending message to ${toAddress || to}: ${message}`);
    return true;
  }

  try {
    return await sendViaTwilio({
      From: TWILIO_WHATSAPP_FROM,
      To: toAddress,
      Body: message,
    });
  } catch (error) {
    console.error('Error sending Twilio WhatsApp message:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  sendTemplateMessage,
  sendTextMessage,
};
