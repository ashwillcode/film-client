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
      Username: username,
      Password: password
    };

    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          onLoggedIn(data.user, data.token);
        } else {
          alert('No such user');
        }
      })
      .catch((e) => {
        alert('Something went wrong');
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