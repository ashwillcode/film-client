import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { MovieCard } from '../movie-card/movie-card';
import { MoviesFilter } from '../movies-filter/movies-filter';

export const MoviesList = ({ movies, onToggleFavorite }) => {
  const filter = useSelector((state) => state.movies.filter);
  const user = useSelector((state) => state.user.user);

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <MoviesFilter />
      <Row className="g-4">
        {filteredMovies.map((movie) => (
          <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MovieCard 
              movie={movie} 
              isFavorite={Boolean(user.favoritemovies?.includes(movie._id))} 
              onToggleFavorite={onToggleFavorite} 
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      imagepath: PropTypes.string.isRequired,
      director: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired
}; 