import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Row, Col, Card, Button, ListGroup, Form, InputGroup } from 'react-bootstrap';
import { QUERY_ME, QUERY_APPOINTMENTS } from '../utils/queries';
import { REMOVE_APPOINTMENT, PROCESS_AI_MESSAGE } from '../utils/mutations';
import Auth from '../utils/auth';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const { loading: loadingUser, data: userData } = useQuery(QUERY_ME);
  const { loading: loadingAppointments, data: appointmentData, refetch } = useQuery(QUERY_APPOINTMENTS);
  const [removeAppointment] = useMutation(REMOVE_APPOINTMENT);
  const [processAiMessage] = useMutation(PROCESS_AI_MESSAGE);
  
  const user = userData?.me || {};
  const appointments = appointmentData?.appointments || [];

  // If data is still loading, display loading message
  if (loadingUser || loadingAppointments) {
    return <h2>Loading...</h2>;
  }

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await removeAppointment({
        variables: { id: appointmentId },
      });
      // Refetch appointments after deletion
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;

    try {
      const { data } = await processAiMessage({
        variables: { message },
      });
      
      setAiResponse(data.processAiMessage);
      setMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!Auth.loggedIn()) {
    return (
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>You need to be logged in to view this page</Card.Title>
                <Link to="/login">
                  <Button variant="primary">Login</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Professional Dashboard</h1>
      </div>
      
      <div className="dashboard-grid">
        <div className="calendar-section">
          <h2>Your Appointments</h2>
          <GoogleCalendarView />
        </div>
        
        <div className="ai-assistant-section">
          <h2>Eric - Your AI Assistant</h2>
          <ChatInterface />
        </div>
        
        <div className="services-section">
          <h2>Manage Services</h2>
          <ServiceManager />
        </div>
        
        <div className="availability-section">
          <h2>Manage Availability</h2>
          <AvailabilityManager />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
