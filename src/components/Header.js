import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import logo from "../assests/images/rakuten-purple-logo.png";
import { AuthContext } from "../AuthProvider";
import { ThemeContext } from "./ThemeContext";

const Header = () => {
  const { keycloak, userInfo } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout({ redirectUri: window.location.origin });
    }
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-3 border-b border-gray-200"
      style={{ color: "rgb(68, 84, 111)", borderBottom: "1px solid #e0e0e0" }}
    >
      <div className="fw-bold fs-5" style={{ color: "rgb(68, 84, 111)" }}>
        <img src={logo} alt="Logo" style={{ height: "30px" }} />
      </div>
            <div className="d-flex align-items-center gap-3">

<div
          onClick={toggleTheme}
          style={{ cursor: "pointer" }}
          className="d-flex align-items-center"
        >
          {theme === "light" ? (
            <>
              <FaMoon size={18} style={{ marginRight: "6px", color: "#555" }} />
              <span>Dark</span>
            </>
          ) : (
            <>
              <FaSun size={18} style={{ marginRight: "6px", color: "#f39c12" }} />
              <span>Light</span>
            </>
          )}
        </div>
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="link"
          className="border-0 p-0"
          style={{ color: "rgb(68, 84, 111)", textDecoration: "none" }}
        >
          <FaUserCircle size={24} style={{ color: "#8529cd" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>{userInfo.name}</Dropdown.Header>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
    </div>
  );
};

export default Header;
