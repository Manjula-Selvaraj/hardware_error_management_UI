import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider'; // adjust the path as needed

export default function Unauthorized() {
  const { keycloak } = useContext(AuthContext);

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout({ redirectUri: window.location.origin });
    }
  };

  return (
    <div>
      <h2>Unauthorized</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
