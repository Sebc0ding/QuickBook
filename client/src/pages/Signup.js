import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { ADD_USER, CREATE_PROFESSIONAL } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '', 
    email: '', 
    password: '',
    phoneNumber: '',
    specialty: '', // Added professional field
    bio: ''        // Added professional field
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);
  // Add mutation to create professional profile
  const [createProfessional] = useMutation(CREATE_PROFESSIONAL);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // First create user account
      const { data } = await addUser({
        variables: { ...formState }
      });
      
      // Then create professional profile
      await createProfessional({
        variables: {
          name: formState.username,
          email: formState.email,
          phoneNumber: formState.phoneNumber,
          specialty: formState.specialty || '', // Default value in case it's empty
          bio: formState.bio || ''               // Default value in case it's empty
        }
      });
      
      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '24rem' }} className="p-4">
        <Card.Title className="text-center">Sign Up</Card.Title>
        <Card.Body>
          {showAlert && (
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
              Something went wrong with your signup!
            </Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your username"
                name="username"
                onChange={handleInputChange}
                value={formState.username}
                required
              />
              <Form.Control.Feedback type="invalid">
                Username is required!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Your email address"
                name="email"
                onChange={handleInputChange}
                value={formState.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                Email is required!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Your phone number (with country code)"
                name="phoneNumber"
                onChange={handleInputChange}
                value={formState.phoneNumber}
                required
              />
              <Form.Control.Feedback type="invalid">
                Phone number is required!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your password"
                name="password"
                onChange={handleInputChange}
                value={formState.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                Password is required!
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-3"
            >
              Sign Up
            </Button>
            <div className="text-center">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Signup;
