import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Login = () => {
  const { keycloak, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!keycloak) {
      console.error("Keycloak instance is not available");
      return;
    }

    if (keycloak.authenticated) {
      console.log('Already authenticated');
      console.log('User info:', keycloak.tokenParsed);
      navigate('/dashboard');
      return;
    }

    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((authenticated) => {
        if (!authenticated) {
          keycloak.login();
        } else {
          console.log('User authenticated');
          console.log('User info:', keycloak.tokenParsed);
          console.log('Username:', keycloak.tokenParsed?.preferred_username);
          console.log('Email:', keycloak.tokenParsed?.email);
          console.log('Roles:', keycloak.tokenParsed?.realm_access?.roles);

          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Keycloak init error:', error);
      });
  };

  // 🚀 Logout and redirect to login
  const handleLogoutAndLogin = () => {
    if (!keycloak) {
      console.error("Keycloak instance is not available");
      return;
    }

    if (keycloak.authenticated) {
      keycloak.logout({
        redirectUri: window.location.origin + '/relogin' // Optional path to trigger login again
      }).then(() => {
        // Optional: setTimeout(() => keycloak.login(), 1000); // if auto trigger needed
        console.log('Logged out successfully');
      }).catch(err => {
        console.error('Logout error', err);
      });
    } else {
      // keycloak.login(); // if not logged in, just login
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Login with Keycloak</button>
      <button onClick={handleLogoutAndLogin} style={{ marginLeft: '10px' }}>
        Logout & Login Again
      </button>
    </div>
  );
};

export default Login;
