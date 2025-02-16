import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');

  const [user, setUser] = useState(storedUser || null);
  const [token, setToken] = useState(storedToken || null);
  const [movies, setMovies] = useState([]);
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
        if (!response.ok) throw new Error('Failed to fetch movies');
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

  const toggleFavorite = async (movieId) => {
    if (!user || !movieId) {
      return;
    }
  
    const isFavorite = user.favoritemovies?.includes(movieId);
    
    try {
      let response;
      
      if (isFavorite) {
        response = await fetch(
          `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}/favorites/${movieId}`,
          {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        response = await fetch(
          `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}/favorites`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ movieId })
          }
        );
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || (isFavorite ? 'Failed to remove from favorites' : 'Failed to add to favorites'));
      }
  
      const data = await response.json();
      
      const updatedUser = {
        ...user,
        favoritemovies: data.favoritemovies || user.favoritemovies
      };
  
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
  
    } catch (error) {
      console.error('Error updating favorites:', error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <Container>
        <NavigationBar user={user} onLogout={onLogout} />
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <NavigationBar user={user} onLogout={onLogout} />
      
      {error && (
        <Alert 
          variant="danger" 
          className="mt-3" 
          onClose={() => setError(null)} 
          dismissible
        >
          {error}
        </Alert>
      )}
      
      <Row>
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/" /> : (
                <Col md={6} className="mx-auto">
                  <LoginView onLoggedIn={(user, token) => { 
                    setUser(user); 
                    setToken(token); 
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('token', token);
                  }} />
                </Col>
              )
            } 
          />

          <Route 
            path="/profile" 
            element={
              !user ? <Navigate to="/login" /> : (
                <ProfileView 
                  user={user} 
                  token={token} 
                  movies={movies} 
                  onUserUpdate={setUser} 
                  onLoggedOut={onLogout} 
                />
              )
            } 
          />

          <Route 
            path="/movies/:movieId" 
            element={
              !user ? <Navigate to="/login" /> : (
                <Col>
                  <MovieView 
                    movies={movies}
                    user={user}
                    onToggleFavorite={toggleFavorite}
                  />
                </Col>
              )
            } 
          />

          <Route 
            path="/" 
            element={
              !user ? <Navigate to="/login" /> : (
                <Row className="g-4">
                  {movies.map((movie) => (
                    <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <MovieCard 
                        movie={movie} 
                        isFavorite={Boolean(user.favoritemovies?.includes(movie._id))} 
                        onToggleFavorite={toggleFavorite} 
                      />
                    </Col>
                  ))}
                </Row>
              )
            } 
          />
        </Routes>
      </Row>
    </Container>
  );
};

export default MainView;
