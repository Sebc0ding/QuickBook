const { google } = require('googleapis');

// Set up Google Calendar API
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/calendar']
  ),
});

// Add event to Google Calendar
const addToGoogleCalendar = async ({ summary, description, startTime, endTime, userEmail }) => {
  try {
    const event = {
      summary,
      description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'America/New_York', // Set your appropriate timezone
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'America/New_York', // Set your appropriate timezone
      },
      attendees: [
        { email: userEmail }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event created: %s', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
};

// Update Google Calendar event
const updateGoogleCalendarEvent = async ({ eventId, summary, description, startTime, endTime }) => {
  try {
    const event = {
      summary,
      description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: 'America/New_York',
      },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: event,
    });

    console.log('Event updated: %s', response.data.htmlLink);
    return response.data;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return null;
  }
};

// Delete Google Calendar event
const deleteGoogleCalendarEvent = async (eventId) => {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
    console.log('Event deleted:', eventId);
    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
};

module.exports = {
  addToGoogleCalendar,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent
};
