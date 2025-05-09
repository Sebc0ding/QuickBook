const { google } = require('googleapis');

// Set up OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // Should be your frontend URL/oauth-callback
);

// Function to get a new auth client with stored refresh token
const getAuthClientForUser = async (refreshToken) => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  client.setCredentials({
    refresh_token: refreshToken
  });
  
  return client;
};

// Create calendar event for a professional using their stored refresh token
const createCalendarEvent = async (professionalId, eventDetails) => {
  try {
    // Get the professional with their refresh token
    const professional = await Professional.findById(professionalId);
    
    if (!professional || !professional.googleRefreshToken) {
      throw new Error('Professional has not connected Google Calendar');
    }
    
    // Get authenticated client
    const authClient = await getAuthClientForUser(professional.googleRefreshToken);
    
    // Create calendar API instance
    const calendar = google.calendar({ version: 'v3', auth: authClient });
    
    // Create event
    const event = {
      summary: eventDetails.title,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.startTime,
        timeZone: 'America/New_York', // You may want to make this dynamic
      },
      end: {
        dateTime: eventDetails.endTime,
        timeZone: 'America/New_York',
      },
      attendees: [
        { email: eventDetails.customerEmail }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      },
    };
    
    const response = await calendar.events.insert({
      calendarId: professional.calendarId || 'primary',
      resource: event,
      sendUpdates: 'all',
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

module.exports = {
  oauth2Client,
  getAuthClientForUser,
  createCalendarEvent
};