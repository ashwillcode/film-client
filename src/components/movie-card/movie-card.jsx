import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await onToggleFavorite(movie._id);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="movie-card-container position-relative">
      {error && (
        <Alert 
          variant="danger" 
          className="position-absolute w-100"
          style={{ top: 0, zIndex: 1000 }}
          onClose={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}
      <div 
        className="movie-card"
        onClick={() => navigate(`/movies/${movie._id}`)}
      >
        <FaHeart
          className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        />
        
        <Card.Img
          variant="top"
          src={movie.imagepath}
          alt={`${movie.title} poster`}
          className="movie-image"
        />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="director-name">Directed by {movie.director?.name}</p>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imagepath: PropTypes.string.isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};