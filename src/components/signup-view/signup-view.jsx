import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';  // Add this import

// Add these validation functions at the top of your component
const validatePassword = {
  length: (password) => password.length >= 8,
  letter: (password) => /[A-Za-z]/.test(password),
  number: (password) => /\d/.test(password),
  special: (password) => /[@$!%*#?&]/.test(password)
};

// Add username validation functions
const validateUsername = {
  length: (username) => username.length >= 3 && username.length <= 30,
  characters: (username) => /^[a-zA-Z0-9_]*$/.test(username)
};

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
          <Form.Text className="text-muted d-block mb-2">
            Username must:
            <ul className="mb-2 ps-3 validation-requirements">
              <li className={validateUsername.length(username) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validateUsername.length(username) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Be between 3 and 30 characters
              </li>
              <li className={validateUsername.characters(username) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validateUsername.characters(username) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Only contain letters, numbers, and underscores
              </li>
            </ul>
          </Form.Text>
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
            Please ensure your username meets all requirements
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Text className="text-muted d-block mb-2">
            Password must:
            <ul className="mb-2 ps-3 password-requirements">
              <li className={validatePassword.length(password) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validatePassword.length(password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Be at least 8 characters long
              </li>
              <li className={validatePassword.letter(password) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validatePassword.letter(password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Include at least one letter
              </li>
              <li className={validatePassword.number(password) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validatePassword.number(password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Include at least one number
              </li>
              <li className={validatePassword.special(password) ? 'text-success' : 'text-muted'}>
                <i className={`bi ${validatePassword.special(password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                Include at least one special character (@$!%*#?&)
              </li>
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

      <style jsx>{`
        .password-requirements li {
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .text-success {
          color: #198754 !important;
        }

        .bi {
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .validation-requirements li {
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

SignupView.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
};