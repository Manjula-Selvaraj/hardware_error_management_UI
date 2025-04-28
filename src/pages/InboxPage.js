import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import TaskDetails from './TaskDetails';

const InboxPage = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
    { id: 11, title: "Activity_12034", user: "fieldOps", date: "2024-03-09 09:30:45", assignie: false, tabs: ['Grafana', 'DC', 'Jira'] },
    { id: 12, title: "Audit_Logs", user: "auditTeam", date: "2024-03-10 07:55:00", assignie: true, tabs: ['TAM', 'Pager'] },
    { id: 13, title: "Upgrade_Check", user: "qaTeam", date: "2024-03-11 13:20:30", assignie: false, tabs: ['BMAaS', 'SRE'] },
    { id: 14, title: "Incident_Response", user: "incidentTeam", date: "2024-03-12 17:05:20", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'] },
  ];

  const tasksPerPage = 6;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedTask(null); // Reset selectedTask when changing page
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />
      <div style={{ height: '2px', backgroundColor: '#ccc', paddingBottom: '2px' }}></div>

      <div className="d-flex" style={{ maxHeight: "100vh", backgroundColor: 'transparent' }}>
        <div
          className={`bg-light border-end sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}
        >
          <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`hover-button ${isHovered ? 'hovered' : ''}`}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <FaChevronRight color={iconColor} />
            ) : (
              <FaChevronLeft color={iconColor} />
            )}
          </div>

          {!isCollapsed && (
            <div className="p-3" style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 mb-2 border rounded"
                    style={{ backgroundColor: selectedTask?.id === task.id ? "#99def3" : "#fff", cursor: "pointer"}}
                    onClick={() => setSelectedTask(task)}
                    aria-label={`Select task ${task.title}`}
                  >
                    <div className='text-start'><strong>{task.title}</strong></div>
                    <div className="text-muted small text-start">{task.user}</div>
                    <div className="text-muted small text-start">{task.date}</div>
                  </div>
                ))
              ) : (
                <p>No tasks available</p>
              )}

              {/* Pagination Controls */}
              <div className="d-flex justify-content-center mt-4 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded bg-light text-primary"
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-primary text-white" : "bg-white text-primary"}`}
                    aria-label={`Page ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded bg-light text-primary"
                  aria-label="Next page"
                >
                  <FaChevronRight />
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
            <p className="text-center mt-4">Select a task to view details</p>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {selectedTask && (
        <button
          className="floating-action-btn"
          onClick={() => { alert("Submit button clicked"); }}
          title="Complete Task"
          aria-label="Complete Task"
        >
          Complete
        </button>
      )}
    </div>
  );
};

export default InboxPage;
