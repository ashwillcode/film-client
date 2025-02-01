import React from 'react';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <img src={movie.poster} alt={movie.title} style={{ width: "300px" }} />
      <h2>{movie.title}</h2>
      <p><strong>Director:</strong> {movie.director}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Description:</strong> {movie.description}</p>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
