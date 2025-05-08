const twilio = require('twilio');

// Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: twilioPhone,
      to
    });
    console.log(`SMS sent with ID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = { sendSms };
