import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Auth from '../utils/auth';

const Home = () => {
  return (
    <Container>
      <Row className="py-5 text-center">
        <Col>
          <h1>AI Appointment Booking</h1>
          <p className="lead">
            Schedule appointments with natural language processing and automated reminders
          </p>
          {Auth.loggedIn() ? (
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Go to Dashboard
            </Button>
          ) : (
            <div>
              <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                Log In
              </Button>
              <Button as={Link} to="/signup" variant="outline-primary" size="lg">
                Sign Up
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="py-4">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Natural Language Booking</Card.Title>
              <Card.Text>
                Simply describe your appointment needs in plain language and our AI will understand your requirements.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Google Calendar Integration</Card.Title>
              <Card.Text>
                All appointments are automatically added to your Google Calendar with convenient reminders.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>SMS Reminders</Card.Title>
              <Card.Text>
                Never miss an appointment with automated SMS reminders sent directly to your phone.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
