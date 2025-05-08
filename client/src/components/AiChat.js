import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, Form, InputGroup, Button } from 'react-bootstrap';
import { PROCESS_AI_MESSAGE } from '../utils/mutations';

const AiChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [processAiMessage, { loading }] = useMutation(PROCESS_AI_MESSAGE);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      // Process with AI
      const { data } = await processAiMessage({
        variables: { message },
      });

      // Add AI response to chat
      const aiResponse = { type: 'ai', text: data.processAiMessage };
      setChatHistory((prev) => [...prev, aiResponse]);

      // Clear input
      setMessage('');
    } catch (error) {
      console.error('Error processing message:', error);
      // Add error message to chat
      const errorMessage = { 
        type: 'ai', 
        text: 'Sorry, I encountered an error processing your request.' 
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <Card>
      <Card.Header>AI Assistant</Card.Header>
      <Card.Body>
        <div 
          className="chat-history mb-3" 
          style={{ 
            height: '300px', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {chatHistory.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>Ask me anything about scheduling appointments!</p>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded ${
                  chat.type === 'user' 
                    ? 'align-self-end bg-primary text-white' 
                    : 'align-self-start bg-light'
                }`}
                style={{ maxWidth: '80%' }}
              >
                {chat.text}
              </div>
            ))
          )}
        </div>
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading || !message.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </InputGroup>
        </Form>
        <small className="text-muted mt-2 d-block">
          Try: "Book a meeting with John tomorrow at 2pm" or "Reschedule my 3pm appointment to 4pm"
        </small>
      </Card.Body>
    </Card>
  );
};

export default AiChat;
