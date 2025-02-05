import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MovieCard } from '../movie-card/movie-card';

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/movies')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching movies:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <h1 className="page-title">Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            isExpanded={movie._id === expandedId}
            onToggle={() => setExpandedId(movie._id === expandedId ? null : movie._id)}
          />
        ))}
      </div>
    </div>
  );
};