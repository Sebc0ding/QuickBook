const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const processWithOpenAI = async (message, user) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI appointment booking assistant. The user's name is ${user.username} and their email is ${user.email}.`
        },
        {
          role: "user", 
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I'm sorry, I couldn't process your request at this time.";
  }
};

module.exports = { processWithOpenAI };
