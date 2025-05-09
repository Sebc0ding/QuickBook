import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CONNECT_GOOGLE_CALENDAR } from '../utils/mutations';

function OAuthCallback() {
  const [status, setStatus] = useState('Processing your request...');
  const navigate = useNavigate();
  const location = useLocation();
  const [connectCalendar] = useMutation(CONNECT_GOOGLE_CALENDAR);
  
  useEffect(() => {
    async function processOAuthCode() {
      try {
        // Get code from URL params
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('Error: No authorization code received');
          return;
        }
        
        // Send code to server
        const { data } = await connectCalendar({
          variables: { code }
        });
        
        if (data?.connectGoogleCalendar) {
          setStatus('Success! Your Google Calendar is connected.');
          // Redirect after success
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('OAuth error:', error);
        setStatus('Error connecting your calendar. Please try again.');
      }
    }
    
    processOAuthCode();
  }, [location, connectCalendar, navigate]);
  
  return (
    <div className="oauth-callback-container">
      <div className="oauth-card">
        <h2>Google Calendar Integration</h2>
        <div className="status-message">
          <p>{status}</p>
          {status.includes('Error') && (
            <button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback;