import React, { useContext, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import { AuthContext } from '../AuthProvider';

const InboxPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
    const { keycloak, setIsAuthenticated } = useContext(AuthContext);
  
  const tasks = ['Task A', 'Task B', 'Task C'];
  const handleLogoutAndLogin = () => {
    if (!keycloak) {
      console.error("Keycloak instance is not available");
      return;
    }

    if (keycloak.authenticated) {
      keycloak.logout({
        redirectUri: window.location.origin + '/relogin' // Optional path to trigger login again
      }).then(() => {
        // Optional: setTimeout(() => keycloak.login(), 1000); // if auto trigger needed
        console.log('Logged out successfully');
      }).catch(err => {
        console.error('Logout error', err);
      });
    } else {
      // keycloak.login(); // if not logged in, just login
    }
  };
  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <div className="bg-primary text-white d-flex justify-content-between align-items-center px-4 py-2">
        <div className="fw-bold fs-5">MyLogo</div>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="text-white border-0 p-0">
            <FaUserCircle size={24} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>User Name</Dropdown.Header>
            <Dropdown.Item>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Left Panel */}
        <div className="border-end p-3" style={{ width: '30%' }}>
          <h6>Tasks</h6>
          {tasks.map((task, i) => (
            <div
              key={i}
              className={`p-2 mb-2 border rounded ${selectedTask === task ? 'bg-light' : ''}`}
              onClick={() => setSelectedTask(task)}
              style={{ cursor: 'pointer' }}
            >
              {task}
            </div>
          ))}
        </div>

        {/* Right Panel */}
        {selectedTask && (
          <div className="p-3" style={{ width: '70%' }}>
            <h6>{selectedTask} Details</h6>
            <button className="btn btn-success me-2">Claim</button>
            <button className="btn btn-danger">Unclaim</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
