import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const KeycloakLoginPage = () => {
  const { keycloak, setIsAuthenticated } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak && keycloak.authenticated) {
      setIsLoggedIn(true);
      const tokenParsed = keycloak.tokenParsed;
      console.log("Token parsed:", keycloak.tokenParsed);

      setUserInfo({
        token: keycloak.token,
        roles: keycloak.tokenParsed?.realm_access?.roles,
        groups: tokenParsed?.groups || [],
        name: tokenParsed?.name,
        email: tokenParsed?.email,      });
    }
  }, [keycloak]);

  const handleLogin = (event) => {
    event.preventDefault();
    
    if (keycloak && !keycloak.authenticated) {
      keycloak.login({
        redirectUri: window.location.origin + '/inbox' 
      }
    
    ).then(() => {
      console.log(userInfo?.token,"2345678");
      
        console.log('User logged in');
      }).catch((err) => {
        console.error('Login error:', err);
      });
    }
  };

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout({
        redirectUri: window.location.origin, 
      }).then(() => {
        console.log('User logged out');
        setIsLoggedIn(false);
        setUserInfo(null);
        navigate('/'); 
      }).catch((err) => {
        console.error('Logout error:', err);
      });
    }
  };

  const handleRouteToInbox = () => {
    navigate('/inbox'); 
  };

  return (
    <div>
      <h2>Hardware Error Management</h2>
      {!isLoggedIn ? (
        <div>
          <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h3>Logged In!</h3>
          <p><strong>Token:</strong> {userInfo?.token}</p>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Name:</strong> {userInfo?.name}</p>
          <p><strong>Roles:</strong> {userInfo?.roles?.join(', ')}</p>
          <p><strong>Groups:</strong> {userInfo?.groups?.join(', ')}</p>
          <button onClick={handleRouteToInbox}>Go to Inbox</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default KeycloakLoginPage;
