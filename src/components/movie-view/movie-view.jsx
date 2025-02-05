import React from 'react';
import PropTypes from 'prop-types';

export const MovieView = ({ movie, onBackClick }) => {
 return (
   <div className="modal">
     <div className="modal-content">
       <div className="modal-body">
         <img 
           src={movie.imagepath || '/api/placeholder/400/600'} 
           alt={movie.title}
           className="modal-image"
         />
         <div className="modal-info">
           <div className="modal-header">
             <h1 className="modal-title">{movie.title}</h1>
             <button onClick={onBackClick} className="close-button">✕</button>
           </div>
           <p className="movie-description">{movie.description}</p>
           <div className="movie-meta">
             <p><strong>Genre:</strong> {movie.genre.name}</p>
             <p><strong>Director:</strong> {movie.director.name}</p>
           </div>
           {movie.featured && <div className="featured-badge">Featured</div>}
         </div>
       </div>
     </div>
   </div>
 );
};

MovieView.propTypes = {
 movie: PropTypes.shape({
   title: PropTypes.string.isRequired,
   description: PropTypes.string,
   imagepath: PropTypes.string,
   genre: PropTypes.shape({
     name: PropTypes.string.isRequired
   }).isRequired,
   director: PropTypes.shape({
     name: PropTypes.string.isRequired
   }).isRequired,
   featured: PropTypes.bool
 }).isRequired,
 onBackClick: PropTypes.func.isRequired
};