import React from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/reducers/movies';

export const MoviesFilter = () => {
  const filter = useSelector((state) => state.movies.filter);
  const dispatch = useDispatch();

  const filterStyles = {
    maxWidth: '300px',
    margin: '1rem auto',
    borderRadius: '20px',
    padding: '0.5rem 1rem',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
    background: 'white'
  };

  const focusStyles = {
    borderColor: '#4ECDC4',
    boxShadow: '0 0 0 0.2rem rgba(78, 205, 196, 0.25)',
    outline: 'none'
  };

  return (
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        placeholder="Search movies..."
        value={filter}
        onChange={(e) => dispatch(setFilter(e.target.value))}
        className="movies-filter"
        style={filterStyles}
      />
      <style>
        {`
          .movies-filter:focus {
            border-color: #4ECDC4 !important;
            box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25) !important;
            outline: none !important;
          }

          .movies-filter::placeholder {
            color: #999;
          }
        `}
      </style>
    </Form.Group>
  );
}; 