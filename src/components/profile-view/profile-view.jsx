import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MovieCard } from '../movie-card/movie-card';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/user';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Simplify date formatting functions
const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'Not set';
  // Keep the date in YYYY-MM-DD format and manually format it
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${month}/${day}/${year}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

export const ProfileView = ({ movies, onLoggedOut }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    currentPassword: '',
    birthday: user?.birthday || ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      const responseData = await response.json();
      
      // Update Redux store with new user data
      const updatedUser = {
        ...user,
        favoritemovies: responseData.favoritemovies || []
      };

      dispatch(setUser(updatedUser));

    } catch (error) {
      console.error('Error removing favorite:', error);
      setError(error.message || 'Failed to remove from favorites');
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!formData.currentPassword) {
        setError("Current password is required to make changes");
        return;
      }

      console.log('Birthday being sent:', formData.birthday);

      const updateData = {
        username: formData.username,
        email: formData.email,
        birthday: formData.birthday,
        password: formData.currentPassword,
        ...(formData.password.trim() !== '' && { newPassword: formData.password })
      };

      const response = await fetch(
        `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const updatedUser = await response.json();
      console.log('Received updated user:', updatedUser);
      
      const updatedUserData = {
        ...user,
        ...updatedUser,
        token,
        favoritemovies: user.favoritemovies,
        birthday: formData.birthday
      };

      console.log('Final user data:', updatedUserData);

      dispatch(setUser(updatedUserData));
      
      setShowEditModal(false);
      setError(null);

      setFormData({
        username: updatedUserData.username,
        email: updatedUserData.email,
        password: '',
        currentPassword: '',
        birthday: updatedUserData.birthday
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
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
              Authorization: `Bearer ${user.token}`
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
              {formatDateForDisplay(user.birthday)}
            </p>
          </div>
        </div>

        {/* Favorite Movies Section */}
        <div className="favorite-movies-section mt-4">
          <h5 className="mb-4">Favorite Movies</h5>
          {favoriteMovies.length === 0 ? (
            <div className="empty-favorites text-center py-5">
              <div className="empty-favorites-icon mb-3">
                <FaHeart size={48} style={{ color: '#ddd' }} />
              </div>
              <h6 className="mb-2">No Favorite Movies Yet</h6>
              <p className="text-muted mb-4">
                Start building your collection by clicking the heart icon on movies you love.
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="browse-movies-btn"
                variant="outline-primary"
              >
                Browse Movies
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {favoriteMovies.map(movie => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4 d-flex align-items-stretch movie-grid-item">
                  <div style={{ width: '100%', height: '100%' }}>
                    <MovieCard
                      movie={movie}
                      isFavorite={true}
                      onToggleFavorite={removeFavorite}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      {/* Custom mobile responsiveness */}
      <style>
        {`
          /* Extra small devices (phones, less than 576px) */
          @media (max-width: 575.98px) {
            .movie-grid-item {
              flex: 0 0 100%; /* 1 card per row */
              max-width: 100%;
            }
          }
          
          /* Small devices (landscape phones, 576px and up) */
          @media (min-width: 576px) and (max-width: 767.98px) {
            .movie-grid-item {
              flex: 0 0 50%; /* 2 cards per row */
              max-width: 50%;
            }
          }
        `}
      </style>

      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        size="md"
        className="edit-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="gradient-text">Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleUpdate} className="edit-form">
            <Form.Group className="mb-3">
              <Form.Label>Username: <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
                minLength="3"
                placeholder="Enter username"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email: <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="Enter email"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Password: <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                placeholder="Enter current password"
                required
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password:</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Leave blank to keep current password"
                className="form-input"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Birthday:</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(formData.birthday)}
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                className="form-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowEditModal(false)}
                className="cancel-button"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="submit-button"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

ProfileView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      title: PropTypes.string,
      imagepath: PropTypes.string,
      director: PropTypes.shape({
        name: PropTypes.string
      })
    })
  ).isRequired,
  onLoggedOut: PropTypes.func.isRequired
};
