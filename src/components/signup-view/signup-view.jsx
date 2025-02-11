import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const SignupView = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    // Match backend's expected format exactly
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
      <form onSubmit={handleSubmit} className="signup-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
            maxLength="30"
            pattern="^[a-zA-Z0-9_]*$"
            title="Username can only contain letters, numbers, and underscores"
            className="form-input"
            placeholder="Enter username"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            title="Password must be at least 8 characters long and include at least one letter, one number, and one special character"
            className="form-input"
            placeholder="Enter password"
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="Enter email"
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="submit-button">Create Account</button>
      </form>
    </div>
  );
};

SignupView.propTypes = {
  onSignupSuccess: PropTypes.func.isRequired
};