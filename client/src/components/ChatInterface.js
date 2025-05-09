import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { PROCESS_AI_MESSAGE } from '../utils/mutations';

function ChatInterface() {
  const [messages, setMessages] = useState([{
    sender: 'Eric',
    text: 'Hello! I\'m Eric, your AI assistant. How can I help with your appointments today?'
  }]);
  const [input, setInput] = useState('');
  const [processAiMessage] = useMutation(PROCESS_AI_MESSAGE);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { sender: 'You', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    
    try {
      // Send to AI and get response
      const { data } = await processAiMessage({
        variables: { message: input }
      });
      
      // Add AI response
      const aiResponse = { sender: 'Eric', text: data.processAiMessage };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Error processing message:', err);
      setMessages(prev => [...prev, { 
        sender: 'Eric', 
        text: 'Sorry, I encountered an error processing your request.' 
      }]);
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'You' ? 'user-message' : 'ai-message'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatInterface;
