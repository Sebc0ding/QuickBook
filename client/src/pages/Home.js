import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your AI Receptionist is Ready</h1>
          <p className="hero-subtitle">
            Let Eric handle your appointments while you focus on what matters—your clients.
          </p>
          
          {Auth.loggedIn() ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <div className="cta-buttons">
              <Link to="/signup" className="cta-button primary">
                Get Started
              </Link>
              <Link to="/login" className="cta-button secondary">
                Log In
              </Link>
            </div>
          )}
        </div>
        
        <div className="hero-image">
          <img src="/images/ai-assistant.svg" alt="AI Assistant illustration" />
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose Our Platform?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>SMS Appointment Booking</h3>
            <p>Clients can book appointments by simply sending a text message to your dedicated number.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Assistant</h3>
            <p>Eric understands natural language and handles scheduling, confirmations, and reminders.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Google Calendar Integration</h3>
            <p>All your appointments sync automatically with your Google Calendar.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Availability Management</h3>
            <p>Set your working hours and Eric will only book appointments when you're available.</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to streamline your booking process?</h2>
        <p>Join hundreds of professionals who trust Eric with their appointments.</p>
        
        {!Auth.loggedIn() && (
          <Link to="/signup" className="cta-button primary large">
            Sign Up Now
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
