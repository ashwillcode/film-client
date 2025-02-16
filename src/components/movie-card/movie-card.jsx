import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="movie-card"
      onClick={() => navigate(`/movies/${movie._id}`)}
    >
      <Card.Img 
        variant="top" 
        src={movie.imagepath}
        alt={`${movie.title} poster`}
        className="movie-image"
      />
      <div className="movie-info">
        <h3 className="movie-title">
          {movie.title}
        </h3>
        <p className="director-name">
          Directed by {movie.director?.name}
        </p>
      </div>

      <style jsx>{`
        
      `}</style>
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
  }).isRequired
};