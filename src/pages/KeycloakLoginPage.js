import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const KeycloakLoginPage = () => {
  const { keycloak, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const hasProcessed = useRef(false); // prevent rerun after redirect

  useEffect(() => {
    if (!keycloak || hasProcessed.current) return;

    if (!keycloak.authenticated) {
      // keycloak.login({ redirectUri: window.location.origin  }); // or "/"
    } else {
      const tokenParsed = keycloak.tokenParsed;
      const roles = tokenParsed?.realm_access?.roles || [];
      const groups = tokenParsed?.groups || [];

      setIsAuthenticated(true);
      hasProcessed.current = true; // block future execution

      // Redirect based on roles/groups
      if (groups.length >= 2) {
        navigate("/groupCheck");
      } else if (roles.includes("Tasklist")) {
        navigate("/tasklist");
      } else {
        navigate("/unauthorized");
      }
    }
  }, [keycloak, navigate, setIsAuthenticated]);

  return null; // no UI
};

export default KeycloakLoginPage;
