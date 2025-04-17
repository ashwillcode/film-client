import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { MovieCard } from '../movie-card/movie-card';

export const MoviesList = ({ movies, onToggleFavorite }) => {
  const filter = useSelector((state) => state.movies.filter);
  const user = useSelector((state) => state.user.user);

  // Safely handle movies filtering in case of missing title
  const filteredMovies = movies.filter(movie => 
    (movie.title || '').toLowerCase().includes(filter.toLowerCase())
  );

  // Handle potential missing user.favoritemovies
  const userFavorites = user?.favoritemovies || [];

  // Check if we have any movies to display
  if (!movies || movies.length === 0) {
    return (
      <Alert variant="info">No movies found. Please try again later.</Alert>
    );
  }

  return (
    <>
      <Row className="g-4">
        {filteredMovies.map((movie) => {
          // Use either id or _id
          const movieId = movie._id || movie.id;
          // Check if this movie is in the user's favorites
          const isFavorite = Boolean(userFavorites.includes(movieId));
          
          return (
            <Col 
              key={movieId} 
              xs={12} 
              sm={6} 
              md={4} 
              lg={3} 
              className="mb-4 d-flex align-items-stretch movie-grid-item"
            >
              <div style={{ width: '100%', height: '100%' }}>
                <MovieCard 
                  movie={movie} 
                  isFavorite={isFavorite} 
                  onToggleFavorite={onToggleFavorite} 
                />
              </div>
            </Col>
          );
        })}
      </Row>
      
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
    </>
  );
};

MoviesList.propTypes = {
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
  onToggleFavorite: PropTypes.func.isRequired
}; 