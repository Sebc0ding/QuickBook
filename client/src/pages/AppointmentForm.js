import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { ADD_APPOINTMENT, UPDATE_APPOINTMENT } from '../utils/mutations';
import { QUERY_APPOINTMENT } from '../utils/queries';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Initial form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // GraphQL operations
  const [addAppointment] = useMutation(ADD_APPOINTMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);
  const { loading, data } = useQuery(QUERY_APPOINTMENT, {
    variables: { id },
    skip: !isEditing,
  });

  // If editing, load the appointment data
  useEffect(() => {
    if (isEditing && data?.appointment) {
      const appointment = data.appointment;
      setFormData({
        title: appointment.title,
        description: appointment.description,
        startTime: new Date(appointment.startTime).toISOString().slice(0, 16),
        endTime: new Date(appointment.endTime).toISOString().slice(0, 16),
      });
    }
  }, [isEditing, data]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!formData.title || !formData.description || !formData.startTime || !formData.endTime) {
      setErrorMessage('All fields are required');
      return false;
    }

    // Check if start time is before end time
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (start >= end) {
      setErrorMessage('Start time must be before end time');
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    // Form validation
    const form = event.currentTarget;
    if (form.checkValidity() === false || !validateForm()) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      setShowAlert(true);
      return;
    }

    try {
      if (isEditing) {
        await updateAppointment({
          variables: {
            id,
            title: formData.title,
            description: formData.description,
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        });
      } else {
        await addAppointment({
          variables: {
            title: formData.title,
            description: formData.description,
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        });
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred while saving the appointment');
      setShowAlert(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <Card className="p-4" style={{ width: '32rem' }}>
          <Card.Title className="text-center">
            {isEditing ? 'Edit Appointment' : 'Create New Appointment'}
          </Card.Title>
          <Card.Body>
            {showAlert && (
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                {errorMessage || 'Something went wrong with your appointment!'}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Appointment title"
                />
                <Form.Control.Feedback type="invalid">
                  Title is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Appointment details"
                  rows={3}
                />
                <Form.Control.Feedback type="invalid">
                  Description is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Start time is required
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  End time is required
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="primary">
                  {isEditing ? 'Update Appointment' : 'Create Appointment'}
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default AppointmentForm;
