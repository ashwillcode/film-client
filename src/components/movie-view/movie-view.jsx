import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <Modal
      show={true}
      onHide={onBackClick}
      centered
      size="lg"
      className="movie-modal"
    >
      <Modal.Body className="p-0">
        <div className="modal-body">
          <img 
            src={movie.imagepath || '/api/placeholder/400/600'} 
            alt={movie.title}
            className="modal-image"
          />
          <div className="modal-info">
            <button onClick={onBackClick} className="close-button">✕</button>
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
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imagepath: PropTypes.string,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
};