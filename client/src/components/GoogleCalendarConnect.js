import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONNECT_GOOGLE_CALENDAR } from '../utils/mutations';

const GoogleCalendarConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectGoogleCalendar] = useMutation(CONNECT_GOOGLE_CALENDAR);
  
  // OAuth configuration
  const oauthClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/oauth-callback`;
  const scope = 'https://www.googleapis.com/auth/calendar';
  
  const handleConnect = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${oauthClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };
  
  // This function would be called from your OAuth callback page
  const handleOAuthCallback = async (code) => {
    try {
      const { data } = await connectGoogleCalendar({
        variables: { code }
      });
      
      if (data?.connectGoogleCalendar?.calendarId) {
        setIsConnected(true);
        localStorage.setItem('calendarConnected', 'true');
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
    }
  };
  
  return (
    <div className="calendar-connect">
      <h3>Google Calendar Integration</h3>
      {isConnected ? (
        <div className="connected-status">
          <p>✅ Your Google Calendar is connected</p>
          <button className="disconnect-btn">Disconnect Calendar</button>
        </div>
      ) : (
        <div className="connect-prompt">
          <p>Connect your Google Calendar to manage appointments</p>
          <button className="connect-btn" onClick={handleConnect}>
            Connect Google Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarConnect;