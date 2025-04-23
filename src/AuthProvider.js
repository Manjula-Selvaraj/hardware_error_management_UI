import React, { createContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const keycloakInstance = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'myrealm',
        clientId: 'react-client-connect',
      });

      keycloakInstance.init({
        // onLoad: 'check-sso',
        // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        // checkLoginIframe: false
      })
        .then(authenticated => {
          setKeycloak(keycloakInstance);
          setIsAuthenticated(authenticated);
        })
        .catch(err => {
          console.error('Keycloak init failed:', err);
        });
    }, []);

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
