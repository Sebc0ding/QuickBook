const express = require('express');
const router = express.Router();
const { processAiMessage } = require('../utils/ai');
const { Professional } = require('../models');
const { User } = require('../models');
const { sendSms } = require('../utils/twilio');

// Handle incoming SMS messages
router.post('/sms', async (req, res) => {
  const { Body: messageBody, From: fromNumber } = req.body;
  
  try {
    console.log(`Received SMS from ${fromNumber}: ${messageBody}`);
    
    // Process message with AI
    const aiResponse = await processAiMessage(messageBody, fromNumber);
    
    // Send AI response back via SMS
    await sendSms(fromNumber, aiResponse);
    
    // Return TwiML response
    const twiml = new MessagingResponse();
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  } catch (error) {
    console.error('Error processing SMS:', error);
    res.status(500).send('Error processing SMS');
  }
});

module.exports = router;