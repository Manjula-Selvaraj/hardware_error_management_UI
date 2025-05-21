<<<<<<< HEAD
import React, { use, useCallback, useContext, useEffect, useState } from 'react';
=======
import React, { useCallback, useEffect, useState, useContext } from 'react';
>>>>>>> 0628f61 (merge conflicts)
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import TaskDetails from './TaskDetails';
import Swal from 'sweetalert2';
import { Card } from 'react-bootstrap';
import newStyled from '@emotion/styled';
import { AuthContext } from '../AuthProvider';
import Spinner from 'react-bootstrap/Spinner';

const InboxPage = () => {

  const { keycloak, setIsAuthenticated } = useContext(AuthContext);

  const [sending, setSending] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState(

    [
      { id: "10000", title: "DC", user: "Devi", date: "2024-02-26 22:19:37", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'], comments: [] },
      { id: "2", title: "Assignie", user: "Start", date: "2024-02-27 09:48:26", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM'], comments: [] },
      { id: "3", title: "SRE", user: "opsTeam", date: "2024-03-01 12:45:00", assignie: false, tabs: ['SRE', 'TAM'], comments: [] },
      { id: "4", title: "BMAaS", user: "adminUser", date: "2024-03-02 15:20:10", assignie: true, tabs: ['BMAaS', 'DC'], comments: [] },
      { id: "5", title: "Pager", user: "backupTeam", date: "2024-03-03 08:30:55", assignie: false, tabs: ['Pager', 'Grafana'], comments: [] },
      { id: "10001", title: "DC", user: "infraTeam", date: "2024-03-04 10:05:20", assignie: true, tabs: ['DC', 'Jira'], comments: [] },
      { id: "7", title: "Grafana", user: "monitorBot", date: "2024-03-05 11:40:15", assignie: false, tabs: ['Grafana', 'SRE'], comments: [] },
      { id: "8", title: "Network_Issue", user: "networkOps", date: "2024-03-06 14:22:48", assignie: true, tabs: ['Pager', 'DC'], comments: [] },
      { id: "9", title: "Patch_Deployment", user: "updateBot", date: "2024-03-07 16:50:33", assignie: false, tabs: ['TAM', 'BMAaS'], comments: [] },
      { id: "10", title: "Incident_900", user: "supportTeam", date: "2024-03-08 18:15:12", assignie: true, tabs: ['SRE', 'Pager', 'Jira'], comments: [] },
      { id: "11", title: "Activity_12034", user: "fieldOps", date: "2024-03-09 09:30:45", assignie: false, tabs: ['Grafana', 'DC', 'Jira'], comments: [] },
      { id: "12", title: "Audit_Logs", user: "auditTeam", date: "2024-03-10 07:55:00", assignie: true, tabs: ['TAM', 'Pager'], comments: [] },
      { id: "13", title: "Upgrade_Check", user: "qaTeam", date: "2024-03-11 13:20:30", assignie: false, tabs: ['BMAaS', 'SRE'], comments: [] },
      { id: "14", title: "Incident_Response", user: "incidentTeam", date: "2024-03-12 17:05:20", assignie: true, tabs: ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'], comments: [] },
    ]
  );
  const handleTaskSelect = async (task) => {
  setSelectedTask(null); // Reset first to force re-render

  try {
    await keycloak.updateToken(60);
    const token = keycloak.token;

    const response = await fetch(`http://localhost:7259/api/tasklist/v1/tasks/${task.id}/variables/search`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error("Failed to fetch variables");
    }

    const variables = await response.json();
    console.log(variables);
    setSelectedTask({
      ...task,
      variables // inject variables into the task object
    });

  } catch (error) {
    console.error("Failed to load task variables:", error);
  }
};

useEffect(() => {
  const fetchTasks = async () => {
    try {
      await keycloak.updateToken(60); 
      const token = keycloak.token;

      const response = await fetch('http://localhost:7259/api/tasklist/v1/tasks/search', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
          state: "CREATED",
          assignee: keycloak.tokenParsed.preferred_username,
          candidateGroups: keycloak.tokenParsed.groups
        })
      });

      const data = await response.json();
      console.log('#####################');
      console.log(data);
      console.log(keycloak.tokenParsed.preferred_username);

      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };
  
  

  if (keycloak.authenticated) {
    fetchTasks();
  }
}, [keycloak]);
  const tasksPerPage = 6;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks ? tasks.slice(indexOfFirstTask, indexOfLastTask) : [];


  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedTask(null); // Reset selectedTask when changing page
    }
  };

  const handleClaimChange = useCallback((taskId, newClaimStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, assignie: newClaimStatus } : task
      )
    );
    // Also update the selectedTask if it's the one being modified
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, assignie: newClaimStatus }));
    }

  }, [selectedTask]);

  const [newJiraComments, setNewJiraComments] = useState([]);
  const onAddJiraComment = (updatedComments) => {
    setNewJiraComments(updatedComments);
  };

  const [newComments, setNewComments] = useState([]);
  const onAddComment = (updatedComments) => {
    setNewComments(updatedComments);
  };


  return (
    <div className="vh-100 d-flex flex-column">
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />

      <div className="d-flex full-height transparent" >
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
            <div className="p-3 full-height scrollable-y" >
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 mb-2 border rounded"
                    style={{ backgroundColor: selectedTask?.id === task.id ? "#99def3" : "#fff", cursor: "pointer" }}
                    onClick={() => handleTaskSelect(task)}
                    aria-label={`Select task ${task.name}`}
                  >
                    <div className='text-start'><strong>{task.name}</strong></div>
                    <div className="text-muted small text-start">{task.assignee}</div>
                    <div className="text-muted small text-start">{task.creationDate}</div>
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
        <Card className="flex-grow-1 d-flex flex-column p-2">
          {selectedTask ? (
            <TaskDetails selectedTask={selectedTask} onClaimChange={handleClaimChange} onAddJiraComment={onAddJiraComment} onAddComment={onAddComment} />
          ) : (
            <p className="text-center mt-4">Select a task to view details</p>
          )}
        </Card>
      </div>

      {/* Floating Action Button */}
      {selectedTask && selectedTask.assignie && (
        <button
          className="floating-action-btn"
          onClick={async () => {
            if (!selectedTask?.id) return;

            const Payload = {
              action: "complete",
              JiraComments: newJiraComments || [],
              comments: newComments || []
            };

            setSending(true);

            try {
              const token = keycloak.token; // Adjust if you use another storage

              const response = await fetch(`http://localhost:8080/v2/user-tasks/${selectedTask?.id}/completion`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(Payload)
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Something went wrong while submitting the task.");
              }

              // If response is OK
              Swal.fire({
                title: "Submitted!",
                text: "Your Task has been submitted Successfully",
                icon: "success",
                confirmButtonText: "OK"
              }).then((result) => {
                if (result.isConfirmed && selectedTask) {
                  setTasks(prevTasks => {
                    const updatedTasks = prevTasks.filter(task => task.id !== selectedTask.id);
                    const updatedTotalPages = Math.ceil(updatedTasks.length / tasksPerPage);
                    if (currentPage > updatedTotalPages) {
                      setCurrentPage(updatedTotalPages > 0 ? updatedTotalPages : 1);
                    }
                    return updatedTasks;
                  });
                  setSelectedTask(null);
                }
              });

            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: error.message || "Something went wrong while submitting the task.",
                icon: "error",
                confirmButtonText: "OK"
              });
            }finally {
              setSending(false);
            }
          }}

          title="Complete Task"
          aria-label="Complete Task"
        >
          {sending ? (
              <>
                <Spinner animation="border" size="sm" role="status" className="me-2" />
                submitting...
              </>
            ) : "Complete"
          }
        </button>
      )
      }
    </div >
  );
};

export default InboxPage;
