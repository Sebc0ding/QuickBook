import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_APPOINTMENTS } from '../utils/queries';

function GoogleCalendarView() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const { loading, data } = useQuery(GET_APPOINTMENTS);
  
  useEffect(() => {
    if (data && data.appointments) {
      setCalendarEvents(data.appointments);
    }
  }, [data]);
  
  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Calendar View</h3>
        <div>
          <button className="btn btn-outline-primary me-2">Connect Google Calendar</button>
          <button className="btn btn-outline-secondary">
            <i className="bi bi-arrow-repeat"></i> Refresh
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : calendarEvents.length > 0 ? (
        <div className="calendar-container">
          {/* Calendar view implementation */}
          <div className="alert alert-info">
            Calendar integration will display your appointments here.
          </div>
          
          <div className="list-group mt-3">
            {calendarEvents.map((event) => (
              <div key={event._id} className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{event.title}</h5>
                  <small>{new Date(parseInt(event.startTime)).toLocaleString()}</small>
                </div>
                <p className="mb-1">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          No appointments scheduled. Your calendar is clear!
        </div>
      )}
    </div>
  );
}

export default GoogleCalendarView;