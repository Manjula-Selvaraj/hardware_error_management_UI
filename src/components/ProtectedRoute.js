import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // You can add role-based access here if needed
  const isAuthorized = useContext(AuthContext).keycloak?.tokenParsed?.realm_access?.roles?.includes('Tasklist');

  if (!isAuthenticated) {
    return <div>Authenticating...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
