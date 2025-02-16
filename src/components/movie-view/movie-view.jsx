import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useParams, useNavigate } from 'react-router-dom';

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  const movie = movies.find(m => m._id === movieId);

  if (!movie) {
    return (
      <div>
        <p>Movie not found</p>
        <Button onClick={() => navigate('/')}>Back to Movies</Button>
      </div>
    );
  }

  return (
    <Modal
      show={true}
      onHide={() => navigate('/')}
      centered
      size="lg"
      className="movie-modal"
      keyboard={true}
    >
      <Modal.Body className="p-0">
        <div className="modal-body">
          <img 
            src={movie.imagepath}
            alt={movie.title}
            className="modal-image"
          />
          <div className="modal-info">
            <button onClick={() => navigate('/')} className="close-button">✕</button>
            <div className="modal-header">
              <h1 className="modal-title">{movie.title}</h1>
            </div>
            <p className="movie-description">{movie.description}</p>
            <div className="movie-meta">
              <p><strong>Genre:</strong> {movie.genre.name}</p>
              <p><strong>Director:</strong> {movie.director.name}</p>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imagepath: PropTypes.string,
      genre: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      director: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired
};