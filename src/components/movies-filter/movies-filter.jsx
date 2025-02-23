import React from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../redux/reducers/movies';

export const MoviesFilter = () => {
  const filter = useSelector((state) => state.movies.filter);
  const dispatch = useDispatch();

  return (
    <Form.Group className="mb-3">
      <Form.Control
        type="text"
        placeholder="Search movies..."
        value={filter}
        onChange={(e) => dispatch(setFilter(e.target.value))}
        className="movies-filter"
      />
      <style jsx>{`
        .movies-filter {
          max-width: 300px;
          margin: 1rem auto;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          transition: all 0.3s ease;
          background: white;
        }

        .movies-filter:focus {
          border-color: #4ECDC4;
          box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25);
          outline: none;
        }

        .movies-filter::placeholder {
          color: #999;
        }
      `}</style>
    </Form.Group>
  );
}; 