import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assests/images/rakuten-purple-logo.png";
import { AuthContext } from "../AuthProvider";

const Header = () => {
  const { keycloak, userInfo } = useContext(AuthContext);

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
  );
};

export default Header;
