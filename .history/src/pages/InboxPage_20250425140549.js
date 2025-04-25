import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import Header from '../components/Header';

const InboxPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const tasks = [
    { id: 1, title: "Activity_14803ry", user: "userdemo", date: "2024-02-26 22:19:37" },
    { id: 2, title: "A", user: "Start", date: "2024-02-27 09:48:26" },
  ];  const [showTasks, setShowTasks] = useState(true);

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />
     <div style={{ height: '2px', backgroundColor: '#ccc' }}></div>
      {/* Main Content */}
      <div className="d-flex" style={{ height: "100vh" }}>
      {/* Left Sidebar */}
      <div
        className="bg-light border-end"
        style={{
          width: isCollapsed ? "70px" : "300px",
          transition: "width 0.3s ease",
          position: "relative",
        }}
      >
        {/* Toggle Button */}
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "absolute",
            top:6,
            right: -15,
            width: "30px",
            height: "27px",
backgroundColor: isHovered ? "rgb(30, 98, 216)" : "white",
            borderRadius: "80%",
border: "1px solid rgb(68, 84, 111)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
        {isCollapsed ? (
          <FaChevronRight color={iconColor}  />
        ) : (
          <FaChevronLeft color={iconColor}  />
        )}        </div>

        {/* Panel Content */}
        {!isCollapsed && (
          <div className="p-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2 mb-2 border rounded"
                style={{ backgroundColor: selectedTask?.id === task.id ? "#e6f0ff" : "#fff", cursor: "pointer" }}
                onClick={() => setSelectedTask(task)}
              >
                <strong>{task.title}</strong>
                <div className="text-muted small">{task.user}</div>
                <div className="text-muted small">{task.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-grow-1 p-4">
        {selectedTask ? (
          <>
            <TaskDetails/>
          </>
        ) : (
          <p>Select a task to view details</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default InboxPage;
