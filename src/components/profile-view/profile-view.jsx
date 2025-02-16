import React from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

export const ProfileView = ({ user }) => {
  return (
    <Container className="py-5">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="profile-name">{user.username}</h3>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <p className="stat-value">0</p>
            <p className="stat-label">Favorite Movies</p>
          </div>
          <div className="stat-item">
            <p className="stat-value">0</p>
            <p className="stat-label">Watchlist</p>
          </div>
        </div>

        <div className="profile-details">
          <h5>Account Details</h5>
          <div className="detail-item">
            <p className="detail-label">Username</p>
            <p className="detail-value">{user.username}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Email</p>
            <p className="detail-value">{user.email}</p>
          </div>
          <div className="detail-item">
            <p className="detail-label">Member Since</p>
            <p className="detail-value">February 2024</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

ProfileView.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};