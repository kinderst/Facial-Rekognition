import React, { Component } from 'react';
import logo from './logo.svg';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// The Header creates links that can be used to navigate
// between routes.
const Header = props => {
  return (
    <Navbar inverse collapseOnSelect>
      <Navbar.Header>
        <LinkContainer to="/" style={{ cursor: 'pointer' }}>
            <Navbar.Brand>
                Facial Rekognition
            </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/about">
            <NavItem eventKey={"about"}>
              About
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/pricing">
            <NavItem eventKey={"pricing"}>
              Pricing
            </NavItem>
          </LinkContainer>
          { props.accessKey &&
            <LinkContainer to="/manage-collections" exact>
              <NavItem eventKey={"managecollections"}>
                Manage Collections
              </NavItem>
            </LinkContainer>
          }
        </Nav>
        <Nav pullRight>
          { props.accessKey ?
            <NavDropdown eventKey={3} title={props.accessKey.substring(0,7) + '...'} id="basic-nav-dropdown" onSelect={props.handleLogOut}>
              <LinkContainer to="/">
                <MenuItem eventKey={"logout"}>Log Out</MenuItem>
              </LinkContainer>
            </NavDropdown>
            :
            <LinkContainer to="/login">
              <NavItem eventKey={"login"}>
                Log In
              </NavItem>
            </LinkContainer>
          }         
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;