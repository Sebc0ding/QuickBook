function GoogleCalendarView() {
  const [appointments, setAppointments] = useState([]);
  const { loading, data } = useQuery(GET_APPOINTMENTS);
  
  useEffect(() => {
    if (data && data.appointments) {
      setAppointments(data.appointments);
    }
  }, [data]);
  
  return (
    <div className="calendar-container">
      {loading ? (
        <p>Loading your appointments...</p>
      ) : (
        <div className="appointments-list">
          <h3>Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <p>No appointments scheduled</p>
          ) : (
            appointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <h4>{appointment.title}</h4>
                <p>{appointment.description}</p>
                <p>Start: {new Date(appointment.startTime).toLocaleString()}</p>
                <p>End: {new Date(appointment.endTime).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Google Calendar Embed - would require OAuth setup */}
      <div className="google-calendar-embed">
        <iframe 
          src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID" 
          style={{ border: 0, width: '100%', height: '400px' }} 
          frameBorder="0" 
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
}