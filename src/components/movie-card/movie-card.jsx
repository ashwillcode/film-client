import React from 'react';
import PropTypes from 'prop-types';
import { MovieView } from '../movie-view/movie-view';

export const MovieCard = ({ movie, isExpanded, onToggle }) => {
  if (isExpanded) {
    return <MovieView movie={movie} onBackClick={onToggle} />;
  }

  return (
    <div className="movie-card" onClick={onToggle}>
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
    title: PropTypes.string.isRequired,
    imagepath: PropTypes.string,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};