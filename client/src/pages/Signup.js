import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

function Signup() {
  // Set initial form state
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  // Set state for form validation
  const [validated, setValidated] = useState(false);
  
  // Set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);

  // Update state based on form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Clear form values
    setFormState({
      username: '',
      email: '',
      password: '',
      phoneNumber: ''
    });
  };

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-header bg-dark text-light p-3">
          <h4 className="m-0">Sign Up</h4>
        </div>
        <div className="card-body">
          {/* This is needed for the validation functionality above */}
          <form noValidate validated={validated} onSubmit={handleFormSubmit}>
            {/* Show alert if server response is bad */}
            {error && (
              <div className="alert alert-danger" role="alert">
                Something went wrong with your signup!
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your username"
                name="username"
                onChange={handleInputChange}
                value={formState.username}
                required
              />
              <div className="invalid-feedback">Username is required!</div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Your email address"
                name="email"
                onChange={handleInputChange}
                value={formState.email}
                required
              />
              <div className="invalid-feedback">Email is required!</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Your password"
                name="password"
                onChange={handleInputChange}
                value={formState.password}
                required
              />
              <div className="invalid-feedback">Password is required!</div>
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Your phone number"
                name="phoneNumber"
                onChange={handleInputChange}
                value={formState.phoneNumber}
                required
              />
              <div className="invalid-feedback">Phone number is required!</div>
            </div>

            <button
              disabled={!(formState.username && formState.email && formState.password && formState.phoneNumber)}
              type="submit"
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
