import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { MovieCard } from '../movie-card/movie-card';
import { LoginView } from '../login-view/login-view';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  // Get stored user data
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');
  
  // State management
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies when component mounts or token changes
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

  // Logout handler
  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    setSelectedMovie(null);
  };

  // If no user, show login view
  if (!user) {
    return (
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <LoginView onLoggedIn={(user, token) => {
              setUser(user);
              setToken(token);
            }} />
          </Col>
        </Row>
      </Container>
    );
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container>
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

  // Main view with movies grid
  return (
    <Container>
      {/* Header with title and logout button */}
      <Row className="mb-4 mt-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h1 className="mb-0">Movies</h1>
          <Button 
            variant="danger" 
            onClick={onLogout}
            className="px-4"
          >
            Logout
          </Button>
        </Col>
      </Row>

      {/* Movies grid */}
      <Row className="g-4">
        {movies.map((movie) => (
          <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MovieCard
              movie={movie}
              onMovieClick={(movie) => setSelectedMovie(movie)}
            />
          </Col>
        ))}
      </Row>

      {/* Movie detail view modal */}
      {selectedMovie && (
        <MovieView 
          movie={selectedMovie}
          onBackClick={() => setSelectedMovie(null)}
        />
      )}
    </Container>
  );
};

export default MainView;