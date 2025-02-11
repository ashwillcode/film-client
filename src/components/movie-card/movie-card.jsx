import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
      <div className="movie-image-container">
        <img 
          src={movie.imagepath || '/api/placeholder/400/600'} 
          alt={movie.title}
          className="movie-image"
        />
        <div className="movie-title-overlay">
          <h2 className="movie-title">{movie.title}</h2>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imagepath: PropTypes.string,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};