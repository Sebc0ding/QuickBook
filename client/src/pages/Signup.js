import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Signup = () => {
  const [userFormData, setUserFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    phoneNumber: '' 
  });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if form has everything
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Reset form
    setUserFormData({
      username: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
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
                value={userFormData.username}
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
                value={userFormData.email}
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
                value={userFormData.phoneNumber}
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
                value={userFormData.password}
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
