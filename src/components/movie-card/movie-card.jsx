import React, { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../../redux/reducers/movies";

export const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use id or _id, whichever is available
  const movieId = movie._id || movie.id;
  
  // Handle potentially missing director info
  const directorName = movie.director?.name || 'Unknown Director';

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onToggleFavorite(movieId, isFavorite);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure we have an image path
  const imagePath = movie.imagepath || '';

  return (
    <div className="movie-card-container position-relative" style={{ height: '100%' }}>
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          background: '#fff'
        }}
        onClick={() => {
          dispatch(setSelectedMovie(movie));
          navigate(`/movies/${movieId}`);
        }}
      >
        <div className="position-relative" style={{ paddingTop: '150%' }}>
          <FaHeart
            className={`favorite-icon ${isFavorite ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 2,
              color: isFavorite ? '#ff6b6b' : '#fff',
              filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          />
          
          <Card.Img
            variant="top"
            src={imagePath}
            alt={`${movie.title} poster`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>
        <div className="movie-info" style={{
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: '90px'
        }}>
          <h3 className="movie-title" style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>{movie.title || 'Untitled'}</h3>
          <p className="director-name" style={{
            fontSize: '14px',
            color: '#000',
            margin: 0
          }}>Directed by {directorName}</p>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    imagepath: PropTypes.string,
    director: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};