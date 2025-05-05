import React, { createContext, useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: 'http://localhost:18080/auth',
      realm: 'camunda-platform',
      clientId: 'camunda-frontend'
    });

    keycloakInstance.init({
      // onLoad: 'login-required',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
      checkLoginIframe: false
    })
      .then(authenticated => {
        console.log(authenticated ? 'Authenticated' : 'Not authenticated');
        setKeycloak(keycloakInstance);

        if (authenticated) {
          const tokenParsed = keycloakInstance.tokenParsed;
          console.log(tokenParsed);

          if (tokenParsed?.realm_access?.roles?.includes("Tasklist")) {
            setIsAuthenticated(true); // ✅ User is authorized
          } else {
            console.warn("User is authenticated but unauthorized");
            setIsAuthenticated(false); // ✅ Explicitly mark as not authorized
          }
        } else {
          setIsAuthenticated(false); // ✅ Not authenticated
        }
      })
      .catch(err => {
        console.error('Keycloak initialization failed', err);
        setIsAuthenticated(false); // ✅ Fail-safe fallback
      });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
