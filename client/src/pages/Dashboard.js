import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { Link } from 'react-router-dom';

// Import the existing components
import GoogleCalendarView from '../components/GoogleCalendarView';
import ChatInterface from '../components/ChatInterface';
import ServiceManager from '../components/ServiceManager';
import AvailabilityManager from '../components/AvailabilityManager';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const { loading, data } = useQuery(QUERY_ME);
  const user = data?.me || {};

  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return (
      <div className="container">
        <div className="card mt-5">
          <div className="card-body text-center">
            <h2 className="card-title">You need to be logged in to view this page</h2>
            <p className="card-text">Please log in or sign up to access your dashboard.</p>
            <div className="mt-4">
              <Link to="/login" className="btn btn-primary me-3">Log In</Link>
              <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                  >
                    Appointments
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                  >
                    Calendar
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                  >
                    Chat with AI
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                  >
                    Services
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'availability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('availability')}
                  >
                    Availability
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'appointments' && (
                <div>
                  <div className="d-flex justify-content-between mb-4">
                    <h2>My Appointments</h2>
                    <Link to="/appointment" className="btn btn-primary">+ Add Appointment</Link>
                  </div>
                  
                  {user.appointments && user.appointments.length > 0 ? (
                    <div className="list-group">
                      {user.appointments.map((appointment) => (
                        <div key={appointment._id} className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">{appointment.title}</h5>
                            <small>{new Date(parseInt(appointment.startTime)).toLocaleString()}</small>
                          </div>
                          <p className="mb-1">{appointment.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      You don't have any appointments yet. Click "Add Appointment" to create one.
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'calendar' && (
                <GoogleCalendarView />
              )}
              
              {activeTab === 'chat' && (
                <ChatInterface />
              )}
              
              {activeTab === 'services' && (
                <ServiceManager />
              )}
              
              {activeTab === 'availability' && (
                <AvailabilityManager />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;