import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { keycloak, isAuthenticated } = useContext(AuthContext);

  if (!keycloak) {
    return <div>Loading...</div>;
  }

  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  const isAuthorized = allowedRoles.some(role => userRoles.includes(role));

  if (!isAuthenticated) return <Navigate to="/" />;
  if (!isAuthorized) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
