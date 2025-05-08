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
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Welcome, {user.username}!</h1>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/appointment/new" variant="success">
            + New Appointment
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Your Appointments</Card.Header>
            <Card.Body>
              {appointments.length ? (
                <ListGroup>
                  {appointments.map((appointment) => (
                    <ListGroup.Item key={appointment._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{appointment.title}</h5>
                        <p className="mb-1">{appointment.description}</p>
                        <small>
                          {formatDate(appointment.startTime)} - {formatDate(appointment.endTime)}
                        </small>
                      </div>
                      <div>
                        <Button
                          as={Link}
                          to={`/appointment/edit/${appointment._id}`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No appointments yet. Create one to get started!</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>AI Assistant</Card.Header>
            <Card.Body>
              <div className="ai-chat-area mb-3" style={{ minHeight: '200px', maxHeight: '300px', overflowY: 'auto' }}>
                {aiResponse && (
                  <div className="ai-response p-2 mb-2 bg-light rounded">
                    <p className="mb-0">{aiResponse}</p>
                  </div>
                )}
              </div>
              <Form onSubmit={handleSendMessage}>
                <InputGroup>
                  <Form.Control
                    placeholder="Ask about scheduling or appointments..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button type="submit" variant="primary">Send</Button>
                </InputGroup>
              </Form>
              <small className="text-muted mt-2 d-block">
                Try: "Book me a doctor appointment next Monday at 2pm" or "What appointments do I have this week?"
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
