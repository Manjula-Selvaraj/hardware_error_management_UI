import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const KeycloakLoginPage = () => {
  const { keycloak, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (!keycloak) return;

    if (!isAuthenticated && !hasProcessed.current) {
      hasProcessed.current = true;
    //  keycloak.login();
      return;
    }

    if (isAuthenticated && keycloak.tokenParsed) {
      const tokenParsed = keycloak.tokenParsed;
      const roles = tokenParsed?.realm_access?.roles || [];
      const groups = tokenParsed?.groups || [];

      setIsAuthenticated(true);

      if (groups.length >= 2) {
        navigate('/groupCheck');
      } else if (roles.includes('Tasklist')) {
        navigate('/tasklist');
      } else {
        navigate('/unauthorized');
      }
    }
  }, [keycloak, isAuthenticated, navigate, setIsAuthenticated]);

  return null;
};

export default KeycloakLoginPage;
