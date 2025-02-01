import React, { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  // State: Holds the list of movies
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: 'Inception',
      description: 'A mind-bending thriller about dream heists.',
      genre: 'Science Fiction',
      director: 'Christopher Nolan',
      poster: '/api/placeholder/300/450'  // Using placeholder with movie poster dimensions
    },
    {
      id: 2,
      title: 'The Matrix',
      description: 'A hacker discovers a hidden reality controlled by AI.',
      genre: 'Action/Sci-Fi',
      director: 'Lana Wachowski, Lilly Wachowski',
      poster: '/api/placeholder/300/450'
    },
    {
      id: 3,
      title: 'Interstellar',
      description: 'A team of explorers ventures into a wormhole in space.',
      genre: 'Science Fiction',
      director: 'Christopher Nolan',
      poster: '/api/placeholder/300/450'
    }
  ]);

  // State: Stores the currently selected movie
  const [selectedMovie, setSelectedMovie] = useState(null);

  // If a movie is selected, display the MovieView component
  if (selectedMovie) {
    return (
      <MovieView 
        movie={selectedMovie} 
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Movies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Loop through the movies array and display a MovieCard for each movie */}
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            onMovieClick={setSelectedMovie}
          />
        ))}
      </div>
    </div>
  );
};