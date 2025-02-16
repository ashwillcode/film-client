import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MovieCard } from '../movie-card/movie-card';

export const ProfileView = ({ user, token, movies = [], onLoggedOut, onUserUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    birthday: user?.birthday || ''
  });

  // Safely filter favorite movies
  const favoriteMovies = React.useMemo(() => {
    if (!movies || !user?.favoritemovies) return [];
    return movies.filter(movie => user.favoritemovies.includes(movie._id));
  }, [movies, user?.favoritemovies]);

  const removeFavorite = async (movieId) => {
    try {
      const response = await fetch(
        `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}/favorites/${movieId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      const responseData = await response.json();
      
      // Create updated user object maintaining all existing user data
      const updatedUser = {
        ...user,
        favoritemovies: responseData.favoritemovies || []
      };

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedUser = await response.json();
      setShowEditModal(false);
      
      // Preserve existing user data while updating changed fields
      const newUserData = {
        ...user,
        ...updatedUser
      };
      
      if (onUserUpdate) onUserUpdate(newUserData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeregister = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(
          `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          onLoggedOut();
        } else {
          throw new Error('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  // Guard against undefined user
  if (!user) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container className="py-5">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <h3 className="profile-name">
            {user.username}
            <button 
              className="edit-button"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit profile"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="currentColor" 
                className="bi bi-pencil" 
                viewBox="0 0 16 16"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
            </button>
          </h3>
          <p className="profile-email">{user.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <p className="stat-value">{favoriteMovies.length}</p>
            <p className="stat-label">Favorite Movies</p>
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
            <p className="detail-label">Birthday</p>
            <p className="detail-value">
              {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Not set'}
            </p>
          </div>
        </div>

        {/* Favorite Movies Section */}
        <div className="favorite-movies-section mt-4">
          <h5 className="mb-4">Favorite Movies</h5>
          {favoriteMovies.length === 0 ? (
            <p>No favorite movies yet</p>
          ) : (
            <Row className="g-4">
              {favoriteMovies.map(movie => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    onToggleFavorite={() => removeFavorite(movie._id)}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        className="profile-edit-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to keep current password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={formData.birthday}
                onChange={e => setFormData({ ...formData, birthday: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="danger"
            onClick={handleDeregister}
          >
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

ProfileView.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    favoritemovies: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  token: PropTypes.string.isRequired,
  movies: PropTypes.array,
  onLoggedOut: PropTypes.func.isRequired,
  onUserUpdate: PropTypes.func
};