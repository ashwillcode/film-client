import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'react-bootstrap';
import { SignupView } from '../signup-view/signup-view';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    setIsSubmitting(true);

    const data = {
      username: username,
      password: password
    };

    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || 'Login failed');
        }
        return responseData;
      })
      .then((data) => {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          onLoggedIn(data.user, data.token);
        } else {
          throw new Error('No user data received');
        }
      })
      .catch((e) => {
        alert(e.message || 'Login failed. Please check your credentials.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="login-container">
      <Form 
        noValidate 
        validated={validated} 
        onSubmit={handleSubmit} 
        className="login-form"
      >
        <h2>Welcome To <span className="">Film!</span></h2>
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            className="form-input"
            placeholder="Enter username"
          />
          <Form.Control.Feedback type="invalid">
            Please enter a username (minimum 3 characters).
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Enter password"
          />
          <Form.Control.Feedback type="invalid">
            Please enter your password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button 
          type="submit" 
          className="submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>

        <div className="signup-prompt">
          <span>Don't have an account?</span>
          <Button 
            variant="link"
            onClick={() => setShowSignup(true)}
            className="signup-link"
            disabled={isSubmitting}
          >
            Sign up
          </Button>
        </div>
      </Form>

      <Modal 
        show={showSignup} 
        onHide={() => setShowSignup(false)} 
        centered
        className="signup-modal"
        keyboard={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SignupView onSignupSuccess={() => setShowSignup(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};