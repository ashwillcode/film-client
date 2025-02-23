import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Alert } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export const MovieView = ({ onToggleFavorite }) => {
  const selectedMovie = useSelector((state) => state.movies.selectedMovie);
  const user = useSelector((state) => state.user.user);
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!selectedMovie) {
    return (
      <div className="text-center p-4">
        <p>Movie not found</p>
        <Button 
          onClick={() => navigate('/')}
          variant="primary"
          className="mt-3"
        >
          Back to Movies
        </Button>
      </div>
    );
  }

  const isFavorite = user?.FavoriteMovies?.includes(movieId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      await onToggleFavorite(selectedMovie._id);
    } catch (error) {
      setError(error.message || 'An error occurred while updating favorites');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <Modal
      show={true}
      onHide={() => navigate('/')}
      centered
      size="lg"
      className="movie-modal"
    >
      <Modal.Body className="p-0">
        {error && (
          <Alert 
            variant="danger" 
            className="m-2"
            onClose={() => setError(null)} 
            dismissible
          >
            {error}
          </Alert>
        )}
        <div className="modal-body">
          <div className="modal-image-container">
            <img
              src={selectedMovie.imagepath}
              alt={selectedMovie.title}
              className="modal-image"
            />
            <FaHeart
              className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            />
          </div>
          
          <div className="modal-info">
            <button onClick={() => navigate('/')} className="close-button">✕</button>
            <div className="modal-header">
              <h1 className="modal-title">{selectedMovie.title}</h1>
            </div>
            <p className="movie-description">{selectedMovie.description}</p>
            <div className="movie-meta">
              <p><strong>Genre:</strong> {selectedMovie.genre.name}</p>
              <p><strong>Director:</strong> {selectedMovie.director.name}</p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

MovieView.propTypes = {
  onToggleFavorite: PropTypes.func.isRequired
};
