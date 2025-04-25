import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import TaskDetails from './TaskDetails';

const InboxPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const tasks = [
    { id: 1, title: "Activity_14803ry", user: "userdemo", date: "2024-02-26 22:19:37", assignie: false, tabs: ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'] },
    { id: 2, title: "Assignie", user: "Start", date: "2024-02-27 09:48:26", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM'] },
  ];

  useEffect(() => {
    // Only show message when it's explicitly set to true and a task is selected
    if (selectedTask && showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false); // Hide the message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or state change
    }
  }, [selectedTask, showMessage]); // Watch for changes in both selectedTask and showMessage

  return (
    <div className="vh-100 d-flex flex-column">
      {/* Header */}
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />
      <div style={{ height: '2px', backgroundColor: '#ccc', paddingBottom: '2px' }}></div>

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
              top: 6,
              right: -15,
              width: "30px",
              height: "27px",
              backgroundColor: isHovered ? "rgb(58, 112, 206)" : "white",
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
              <FaChevronRight color={iconColor} />
            ) : (
              <FaChevronLeft color={iconColor} />
            )}
          </div>

          {/* Panel Content */}
          {!isCollapsed && (
            <div className="p-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 mb-2 border rounded"
                  style={{ backgroundColor: selectedTask?.id === task.id ? "#99def3" : "#fff", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowMessage(false); // Hide the message when a new task is selected
                  }}
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
        <div className="flex-grow-1 p-2">
          {selectedTask ? (
            <TaskDetails selectedTask={selectedTask} />
          ) : (
            <p>Select a task to view details</p>
          )}
        </div>
      </div>

      {/* ✅ Floating Action Button */}
      {selectedTask && (
        <>
          <button
            onClick={() => setShowMessage(true)} // Set message to true on button click
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#cce5ff",
              color: "#004085",
              border: "none",
              borderRadius: "5%",
              width: "120px",
              height: "40px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              fontSize: "22px",
              cursor: "pointer",
              zIndex: 1000
            }}
            title="Complete Task"
          >
            Complete
          </button>

          <div className={`fade-message-box ${showMessage ? 'visible' : 'hidden'}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Submit your action and complete the task!</span>
              <button onClick={() => setShowMessage(false)} className="close-button">
                ❌
              </button>
            </div>

            <button className="completeBtn" onClick={(e)=>{alert("Submit button is clicked")}}>
              <strong> Submit  <span>📤</span> </strong>
            </button>
          </div>

        </>
      )}

      {/* Fade Animation Styles */}
      <style>{`
        .fade-message-box.hidden {
          opacity: 0;
          pointer-events: none;
        }
        .fade-message-box.visible {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default InboxPage;
