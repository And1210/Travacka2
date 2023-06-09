import {React, useContext} from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {AuthContext} from './context/AuthContext';

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #000000;
  &:after {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const NavLogo = styled(Link)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #FFFFFF;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  padding-inline-start: 0;
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  font-size: 1.5rem;
  color: #FFFFFF;

  &:hover {
    transform: translate(0, -2px);
  }
  &:link {
    text-decoration: none;
  }
`;

function Navbar() {
  const {loggedIn} = useContext(AuthContext);
  // let loginText = 'Login';
  // if (loggedIn) {
  //   loginText = 'Logout';
  // }

    // <NavLogo className="font-del-hand" to="/">Travacka</NavLogo>
    // {!loggedIn && (<NavLink className="font-del-hand" to="/Signup">Signup</NavLink>)}
  return (
    <Nav>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        {loggedIn && (<NavLink to="/upload">Upload</NavLink>)}
        {loggedIn && (<NavLink to="/account">Account</NavLink>)}
      </NavLinks>
    </Nav>
  );
}

export default Navbar;
