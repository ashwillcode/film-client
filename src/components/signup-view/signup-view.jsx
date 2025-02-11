import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';  // Add this import

export const SignupView = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
      email: email,
      birthday: birthday
    };

    console.log('Attempting to sign up with data:', data);

    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Signup failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Signup successful:', data);
        alert('Signup successful! Please log in.');
        onSignupSuccess();
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert(error.message || 'Signup failed. Please try again.');
      });
  };

  return (
    <div className="signup-container">
      <Form onSubmit={handleSubmit} className="signup-form">
        <Form.Group className="mb-3">
          <Form.Label>Username:</Form.Label>
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
            Username can only contain letters, numbers, and underscores
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password:</Form.Label>
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
            Password must be at least 8 characters long and include at least one letter, one number, and one special character
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

        <button type="submit" className="submit-button">Create Account</button>
      </Form>
    </div>
  );
};

SignupView.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
};