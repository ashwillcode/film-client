import React from 'react';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => onMovieClick(movie)}
      style={{ cursor: "pointer", padding: "10px", border: "1px solid black", margin: "10px" }}
    >
      <h2>{movie.title}</h2>
    </div>
  );
};
