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
  
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
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

  // Show loading spinner while fetching data
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

  // Show error message if there's an error
  if (error) {
    return (
      <Container>
        <NavigationBar user={user} onLogout={onLogout} />
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Alert variant="danger">
              Error: {error}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <NavigationBar user={user} onLogout={onLogout} />
      
      <Row>
        <Routes>
          {/* Login Route */}
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Col md={6} className="mx-auto">
                  <LoginView 
                    onLoggedIn={(user, token) => {
                      setUser(user);
                      setToken(token);
                    }} 
                  />
                </Col>
              )
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <ProfileView user={user} />
              )
            }
          />

          {/* Movie Details Route */}
          <Route
            path="/movies/:movieId"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <Col>
                  <MovieView 
                    movies={movies}
                  />
                </Col>
              )
            }
          />

          {/* Main Movies Grid Route */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <Row className="g-4">
                  {movies.map((movie) => (
                    <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <MovieCard movie={movie} />
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