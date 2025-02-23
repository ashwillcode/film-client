import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';  // Add this import

export const SignupView = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formattedBirthday = birthday ? new Date(birthday).toISOString() : null;
      
      const signupData = {
        username: username,
        password: password,
        email: email,
        birthday: formattedBirthday
      };

      const response = await fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      alert('Signup successful! Please login.');
      onSignupSuccess();

    } catch (error) {
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <Form onSubmit={handleSubmit} className="signup-form">
        <Form.Group className="mb-3">
          <Form.Label>Username: <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            maxLength="30"
            pattern="^[a-zA-Z0-9_]*$"
            className="form-input"
            placeholder="Enter username"
          />
          <Form.Control.Feedback type="invalid">
            Username must be between 3 and 30 characters
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Text className="text-muted d-block mb-2">
            Password must:
            <ul className="mb-2 ps-3">
              <li>Be at least 8 characters long</li>
              <li>Include at least one letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character (@$!%*#?&)</li>
            </ul>
          </Form.Text>
          <Form.Label>Password: <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            className="form-input"
            placeholder="Enter password"
          />
          <Form.Control.Feedback type="invalid">
            Please ensure your password meets all requirements
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password: <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isInvalid={confirmPassword && !passwordsMatch}
            className="form-input"
            placeholder="Confirm your password"
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="Enter email"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid email address
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="form-input"
          />
          <Form.Control.Feedback type="invalid">
            Please select your birthday
          </Form.Control.Feedback>
        </Form.Group>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting || (confirmPassword && !passwordsMatch)}
        >
          Create Account
        </button>
        {error && <div className="error-message">{error}</div>}
      </Form>
    </div>
  );
};

SignupView.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
};