// src/components/Header.js
import React, { useContext } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
// import logo from "C:/Users/STS177/Desktop/logo.png"
import logo from "../assests/images/logo.png"
import Keycloak from 'keycloak-js';
import { AuthContext } from '../AuthProvider';

const Header = () => 
  
  
  {
    const { keycloak, userInfo } = useContext(AuthContext);
    console.log(userInfo.name, 'f');

    const handleLogout = () => {
      if (keycloak) {
        keycloak.logout({ redirectUri: window.location.origin });
      }
    };
  
    
  
  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-2"
      style={{color: 'rgb(68, 84, 111)' }}
    >
      <div className="fw-bold fs-5" style={{ color: 'rgb(68, 84, 111)' }}>
      <img src={logo} alt="Logo" style={{ height: '30px' }} />
      </div>

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="link"
          className="border-0 p-0"
          style={{ color: 'rgb(68, 84, 111)', textDecoration: 'none' }}
        >
          <FaUserCircle size={24} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>{userInfo.name}</Dropdown.Header>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Header;
