import React, { useState } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/reducers/user";
import { setFilter } from "../../redux/reducers/movies";

export const NavigationBar = ({ onLogout }) => {
  const user = useSelector((state) => state.user.user);
  const filter = useSelector((state) => state.movies.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => setExpanded(false);

  const handleLogout = () => {
    handleClose();
    
    // Call parent onLogout if provided
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback to local implementation
      dispatch(clearUser());
      localStorage.clear();
    }
    
    navigate('/login');
  };

  const searchStyles = {
    borderRadius: '20px',
    padding: '0.4rem 1rem',
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
    background: 'white',
    width: '250px',
    height: '38px',
    margin: 0
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="py-3 align-items-center"
      expanded={expanded}
      onToggle={setExpanded}
      style={{ minHeight: '70px' }}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="brand-text"
          onClick={handleClose}
          style={{ 
            fontFamily: "'Poppins', sans-serif",
            fontSize: '1.5rem',
            fontWeight: '600',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Film
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user && (
            <Form className="d-flex mx-auto align-items-center flex-grow-1 justify-content-center" style={{ margin: 0, padding: 0 }}>
              <Form.Control
                type="text"
                placeholder="Search movies..."
                value={filter}
                onChange={(e) => dispatch(setFilter(e.target.value))}
                className="search-input"
                style={searchStyles}
              />
            </Form>
          )}
          <Nav className="ms-auto">
            {!user ? (
              <Nav.Link 
                as={Link} 
                to="/login"
                className="nav-link px-4 text-dark"
                onClick={handleClose}
              >
                Login or Signup
              </Nav.Link>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/"
                  className="nav-link px-4 text-dark"
                  onClick={handleClose}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/profile"
                  className="nav-link px-4 text-dark"
                  onClick={handleClose}
                >
                  Profile
                </Nav.Link>
                <Nav.Link 
                  onClick={handleLogout}
                  className="nav-link px-4 text-dark"
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          .navbar {
            display: flex;
            align-items: center;
          }
          
          .navbar-collapse {
            display: flex;
            align-items: center;
          }
          
          .form-control {
            line-height: normal;
          }
          
          .search-input:focus {
            border-color: #4ECDC4 !important;
            box-shadow: 0 0 0 0.2rem rgba(78, 205, 196, 0.25) !important;
            outline: none !important;
          }

          .search-input::placeholder {
            color: #999;
          }

          @media (max-width: 991.98px) {
            .search-input {
              margin-top: 15px;
              margin-bottom: 15px;
              width: 100% !important;
            }
          }
        `}
      </style>
    </Navbar>
  );
};

NavigationBar.propTypes = {
  onLogout: PropTypes.func
};
