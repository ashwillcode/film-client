import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SignupView } from '../signup-view/signup-view';

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password
    };

    console.log('Attempting to login with:', { username }); // Don't log password

    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async (response) => {
        const responseData = await response.json();
        console.log('Server response:', responseData); // Log the full response

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
        console.error('Login error:', e);
        alert(e.message || 'Login failed. Please check your credentials.');
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
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
            className="form-input"
            placeholder="Enter password"
          />
        </label>
        <button type="submit" className="submit-button">Login</button>
        <div className="signup-prompt">
          <span>Don't have an account?</span>
          <button 
            type="button" 
            onClick={() => setShowSignup(true)}
            className="signup-link"
          >
            Sign up
          </button>
        </div>
      </form>

      {showSignup && (
        <div className="signup-modal__backdrop">
          <div className="signup-modal__content">
            <button 
              className="signup-modal__close"
              onClick={() => setShowSignup(false)}
            >
              ✕
            </button>
            <SignupView onSignupSuccess={() => setShowSignup(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
};