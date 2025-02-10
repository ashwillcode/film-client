import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
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
  }, [token]);

  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  if (!user) {
    return (
      <LoginView onLoggedIn={(user, token) => {
        setUser(user);
        setToken(token);
      }} />
    );
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="container">
      <div className="header">
        <h1 className="page-title">Movies</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onMovieClick={(movie) => setSelectedMovie(movie)}
          />
        ))}
      </div>

      {selectedMovie && (
        <MovieView 
          movie={selectedMovie}
          onBackClick={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};