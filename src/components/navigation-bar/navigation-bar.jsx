import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../redux/reducers/user";

export const NavigationBar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => setExpanded(false);

  const handleLogout = () => {
    handleClose();
    dispatch(clearUser());
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="py-3"
      expanded={expanded}
      onToggle={setExpanded}
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
    </Navbar>
  );
};

NavigationBar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired
};
