import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PROFESSIONAL } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';

function Onboarding() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    specialty: '',
    bio: ''
  });
  
  const [createProfessional, { loading }] = useMutation(CREATE_PROFESSIONAL);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create professional profile
      const { data } = await createProfessional({
        variables: { ...formState }
      });
      
      if (data?.createProfessional) {
        // Redirect to next step - adding services
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating professional profile:', err);
    }
  };
  
  // Check if user is logged in
  if (!Auth.loggedIn()) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-card">
          <h2>You need to log in first</h2>
          <p>Please log in or sign up to create your professional profile.</p>
          <div className="button-group">
            <button onClick={() => navigate('/login')}>Log In</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Tell us about yourself</h2>
            <p>Let's start by setting up your professional profile.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="form-group">
                <label htmlFor="name">Your Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="button-group">
                <button type="submit">Next</button>
              </div>
            </form>
          </div>
        );
        
      case 2:
        return (
          <div className="onboarding-step">
            <h2>Your Professional Details</h2>
            <p>Now, tell us about your specialty and experience.</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="specialty">Your Specialty</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formState.specialty}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Hair Stylist, Massage Therapist, Personal Trainer"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Professional Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formState.bio}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell your clients about your experience and qualifications..."
                ></textarea>
              </div>
              
              <div className="button-group">
                <button type="button" onClick={() => setStep(1)}>Back</button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating Profile...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
      </div>
      
      <div className="onboarding-card">
        {renderStep()}
      </div>
    </div>
  );
}

export default Onboarding;