import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Alert } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

export const MovieView = ({ movies, user, onToggleFavorite }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  const movie = movies.find(m => m._id === movieId);
  const isFavorite = user?.FavoriteMovies?.includes(movieId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      console.log('MovieView: Attempting to toggle favorite:', {
        movieId: movie._id,
        currentlyFavorite: isFavorite,
        userFavorites: user?.FavoriteMovies
      });
      
      await onToggleFavorite(movie._id);
      
      console.log('MovieView: Successfully toggled favorite');
    } catch (error) {
      console.error('MovieView: Error in handleFavoriteClick:', error);
      setError(error.message || 'An error occurred while updating favorites');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!movie) {
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
              src={movie.imagepath}
              alt={movie.title}
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
              <h1 className="modal-title">{movie.title}</h1>
            </div>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <p><strong>Genre:</strong> {movie.genre.name}</p>
              <p><strong>Director:</strong> {movie.director.name}</p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

MovieView.propTypes = {
  movies: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};