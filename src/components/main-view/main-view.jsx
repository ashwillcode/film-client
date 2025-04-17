import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { NavigationBar } from '../navigation-bar/navigation-bar';
import { ProfileView } from '../profile-view/profile-view';
import { MoviesList } from '../movies-list/movies-list';
import { setMovies, setLoading, setError } from '../../redux/reducers/movies';
import { setUser, setToken, clearUser } from '../../redux/reducers/user';

export const MainView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const loading = useSelector((state) => state.movies.loading);
  const error = useSelector((state) => state.movies.error);
  const movies = useSelector((state) => state.movies.list);

  useEffect(() => {
    if (!token) {
      dispatch(setLoading(false));
      return;
    }

    dispatch(setLoading(true));
    fetch('https://filmapi-ab3ce15dfb3f.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch movies');
        return response.json();
      })
      .then(data => {
        console.log("Movies data received:", data);
        // Map API response fields to expected structure with better case handling
        const mappedMovies = data.map(movie => ({
          _id: movie.id || movie._id,
          title: movie.title || movie.Title || "",
          imagepath: movie.imagepath || movie.ImagePath || movie.Imagepath || "",
          director: movie.director || movie.Director || { name: "Unknown Director" },
          genre: movie.genre || movie.Genre || { name: "Unknown Genre" },
          description: movie.description || movie.Description || "",
          Featured: movie.Featured !== undefined ? movie.Featured : false
        }));
        console.log("Mapped movies:", mappedMovies);
        dispatch(setMovies(mappedMovies));
        dispatch(setLoading(false));
      })
      .catch(err => {
        console.error('Error fetching movies:', err);
        dispatch(setError(err.message));
        dispatch(setLoading(false));
      });
  }, [token, dispatch]);

  const onLogout = () => {
    dispatch(clearUser());
  };

  const toggleFavorite = async (movieId, isCurrentlyFavorite) => {
    if (!user || !movieId || !token) return;

    try {
      const url = isCurrentlyFavorite
        ? `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}/favorites/${movieId}`
        : `https://filmapi-ab3ce15dfb3f.herokuapp.com/users/${user.username}/favorites`;

      const response = await fetch(url, {
        method: isCurrentlyFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        ...((!isCurrentlyFavorite) && { body: JSON.stringify({ movieId }) })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isCurrentlyFavorite ? 'remove from' : 'add to'} favorites`);
      }

      const data = await response.json();
      
      // Update Redux store with new user data
      dispatch(setUser({
        ...user,
        favoritemovies: data.favoritemovies || [],
        token
      }));

    } catch (error) {
      console.error('Error updating favorites:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <Container>
        <NavigationBar />
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
      <NavigationBar onLogout={onLogout} />
      
      {error && (
        <Alert 
          variant="danger" 
          className="mt-3" 
          onClose={() => dispatch(setError(null))} 
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
                  <LoginView />
                </Col>
              )
            } 
          />

          <Route 
            path="/profile" 
            element={
              !user ? <Navigate to="/login" /> : (
                <ProfileView 
                  movies={movies}
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
                  <MovieView onToggleFavorite={toggleFavorite} />
                </Col>
              )
            } 
          />

          <Route 
            path="/" 
            element={
              !user ? <Navigate to="/login" /> : (
                <MoviesList 
                  movies={movies}
                  onToggleFavorite={toggleFavorite}
                />
              )
            } 
          />
        </Routes>
      </Row>
    </Container>
  );
};

export default MainView;
