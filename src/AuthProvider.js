import React, { createContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
      const keycloakInstance = new Keycloak({
        url: 'http://localhost:18080/auth',
        realm: 'camunda-platform',
        clientId: 'camunda-frontend',
      });

      keycloakInstance.init({
        // onLoad: 'login-required',
        // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
        // checkLoginIframe: false
      })
        .then(authenticated => {
          setKeycloak(keycloakInstance);
          setIsAuthenticated(authenticated);
          if (authenticated) {
            const tokenParsed = keycloakInstance.tokenParsed;
            setUserInfo({
              token: keycloakInstance.token,
              roles: tokenParsed?.realm_access?.roles || [],
              groups: tokenParsed?.groups || [],
              name: tokenParsed?.name,
              email: tokenParsed?.email,
            });
            console.log('User Info:', tokenParsed);
            const name = tokenParsed?.name;
            setUserInfo({ name });

          }
        })
        .catch(err => {
          console.error('Keycloak init failed:', err);
        });
    }, []);

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated, setIsAuthenticated,userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
