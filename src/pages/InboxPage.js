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
    { id: 3, title: "Incident_456", user: "opsTeam", date: "2024-03-01 12:45:00", assignie: false, tabs: ['SRE', 'TAM'] },
    { id: 4, title: "Maintenance_789", user: "adminUser", date: "2024-03-02 15:20:10", assignie: true, tabs: ['BMAaS', 'DC'] },
    { id: 5, title: "Backup_Schedule", user: "backupTeam", date: "2024-03-03 08:30:55", assignie: false, tabs: ['Pager', 'Grafana'] },
    { id: 6, title: "Server_Update", user: "infraTeam", date: "2024-03-04 10:05:20", assignie: true, tabs: ['DC', 'Jira'] },
    { id: 7, title: "Health_Check", user: "monitorBot", date: "2024-03-05 11:40:15", assignie: false, tabs: ['Grafana', 'SRE'] },
    { id: 8, title: "Network_Issue", user: "networkOps", date: "2024-03-06 14:22:48", assignie: true, tabs: ['Pager', 'DC'] },
    { id: 9, title: "Patch_Deployment", user: "updateBot", date: "2024-03-07 16:50:33", assignie: false, tabs: ['TAM', 'BMAaS'] },
    { id: 10, title: "Incident_900", user: "supportTeam", date: "2024-03-08 18:15:12", assignie: true, tabs: ['SRE', 'Pager', 'Jira'] },
    { id: 10, title: "Incident_900", user: "supportTeam", date: "2024-03-08 18:15:12", assignie: true, tabs: ['SRE', 'Pager', 'Jira'] },
    { id: 11, title: "Activity_12034", user: "fieldOps", date: "2024-03-09 09:30:45", assignie: false, tabs: ['Grafana', 'DC', 'Jira'] },
    { id: 12, title: "Audit_Logs", user: "auditTeam", date: "2024-03-10 07:55:00", assignie: true, tabs: ['TAM', 'Pager'] },
    { id: 13, title: "Upgrade_Check", user: "qaTeam", date: "2024-03-11 13:20:30", assignie: false, tabs: ['BMAaS', 'SRE'] },
    { id: 14, title: "Incident_Response", user: "incidentTeam", date: "2024-03-12 17:05:20", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'] },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6; // Show 6 tasks per page

  // Calculate the current tasks to show
  const indexOfLastTask = currentPage * tasksPerPage;  // End index for slicing tasks
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;  // Start index for slicing tasks
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask); // Sliced tasks

  const totalPages = Math.ceil(tasks.length / tasksPerPage); // Total number of pages

  const handlePageChange = (pageNumber) => {
    // Make sure the page number is within valid bounds
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


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
      <div className="d-flex" style={{ maxHeight: "100vh" }}>
        {/* Left Sidebar */}
        <div
          className="bg-light border-end"
          style={{
            width: isCollapsed ? "70px" : "300px",
            transition: "width 0.3s ease",
            position: "relative",
            // height: '100vh', overflowY: 'auto',paddingRight: "15px", 
            // scrollbarWidth: 'thin', /* For Firefox */
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
            <div className="p-3" style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
              {currentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 mb-2 border rounded"
                  style={{ backgroundColor: selectedTask?.id === task.id ? "#99def3" : "#fff", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowMessage(false); // Hide the message when a new task is selected
                  }}
                >
                  <div className='text-start'><strong>{task.title}</strong></div>
                  <div className="text-muted small text-start">{task.user}</div>
                  <div className="text-muted small  text-start">{task.date}</div>
                </div>
              ))}

              <div className="d-flex justify-content-center mt-4 gap-2">
                {/* Previous Page Button */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-light text-primary"
                >
                  &laquo;
                </button>


                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-white text-primary"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  // onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-light text-primary"
                >
                  &raquo;
                </button>
              </div>
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
            className='floating-action-btn'
            onClick={(e) => { alert("Submit button is clicked")}} // Set message to true on button click
            title="Complete Task"
          >
            Complete
          </button>
{/* 
          <div className={`fade-message-box ${showMessage ? 'visible' : 'hidden'}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Submit your action and complete the task!</span>
              <button onClick={() => setShowMessage(false)} className="close-button">
                ❌
              </button>
            </div>

            <button className="completeBtn" onClick={(e) => { alert("Submit button is clicked") }}>
              <strong> Submit  <span>📤</span> </strong>
            </button> 
          </div> */}

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
