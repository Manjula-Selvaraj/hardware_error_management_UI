import React, { useCallback, useEffect, useState, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import TaskDetails from "./TaskDetails";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { AuthContext } from "../AuthProvider";
import Spinner from "react-bootstrap/Spinner";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import "../App.scss";
const InboxPage = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const complete_url = process.env.REACT_APP_COMPLETE_URL;
  const { keycloak } = useContext(AuthContext);

  const [sending, setSending] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [newComments, setNewComments] = useState([]);
  const [newJiraComments, setNewJiraComments] = useState([]);

  const handleTaskSelect = async (task) => {
    setSelectedTask(null); // Reset first to force re-render

    try {
      await keycloak.updateToken(60);
      const token = keycloak.token;

      const response = await fetch(`${base_url}/${task.id}/variables/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch variables");
      }

      const variables = await response.json();
      setSelectedTask({
        ...task,
        variables, // inject variables into the task object
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
        const response = await fetch(`${base_url}/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: "CREATED",
            assignee: keycloak.tokenParsed.preferred_username,
            candidateGroups: keycloak.tokenParsed.groups,
          }),
        });

        const data = await response.json();

        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
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
  const currentTasks = tasks
    ? tasks?.slice(indexOfFirstTask, indexOfLastTask)
    : [];

  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedTask(null); // Reset selectedTask when changing page
    }
  };

  const handleClaimChange = useCallback(
    (taskId, newClaimStatus) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, assignee: newClaimStatus } : task
        )
      );
      // Also update the selectedTask if it's the one being modified
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask((prev) => ({ ...prev, assignee: newClaimStatus }));
      }
    },
    [selectedTask]
  );

  const onAddJiraComment = (updatedComments) => {
    setNewJiraComments(updatedComments);
  };

  const onAddComment = (updatedComments) => {
    setNewComments(updatedComments);
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 100,
       headerClassName: "themed-header",
    cellClassName: "themed-cell",
      valueGetter: (value, row) => {
        if (!row || !row.id) return "";
        // Find the index of the row in the tasks array and add 1 for serial number
        const index = tasks.findIndex((t) => t.id === row.id);
        return  index >= 0 ? index + 1 : "";
      },
    },
    { field: "id", headerName: "ID", width: 150, headerClassName: "themed-header",
    cellClassName: "themed-cell", },
    { field: "name", headerName: "Task Name", width: 280, headerClassName: "themed-header",
    cellClassName: "themed-cell",},
    {
      field: "processName",
      headerName: "Process Name",
      width: 280,
       headerClassName: "themed-header",
    cellClassName: "themed-cell",
      renderCell: (params) => {
        console.log("Row data:", params);
        return (
          <div
          className="assigned"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#e0e7ff",
                color: "#3730a3",
                borderRadius: "5px",
                padding: "0px 10px",
                fontSize: "0.95em",
                fontWeight: 500,
                height: "30px",
                lineHeight: "30px",
              }}
            >
              {params.row.processName}
            </div>
          </div>
        );
      },
    },
    {
      field: "creationDate",
      headerName: "Created At",
      width: 180, headerClassName: "themed-header",
    cellClassName: "themed-cell",
      className:"assigned",
      valueGetter: (value, row) =>
        row.creationDate
          ? new Date(row.creationDate || "").toLocaleString()
          : "",
    },
    { field: "assignee", headerName: "Assignee", width: 150 , className:"assigned", headerClassName: "themed-header",
    cellClassName: "themed-cell",
},
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
       headerClassName: "themed-header",
    cellClassName: "themed-cell",
      className:"assigned"
    },
    {
      field: "action",
      headerName: "View",
      width: 80,
       headerClassName: "themed-header",
    cellClassName: "themed-cell",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button 
className="assigned"          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
          title="View Task"
          onClick={(e) => {
            e.stopPropagation();
            const task = tasks.find((t) => t.id === params.id);
            if (task) handleTaskSelect(task);
          }}
        >
          <span style={{ color: "#44546f", fontSize: "1.2rem" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4.5c-3.584 0-6.29-3.13-7.288-4.5C1.71 6.13 4.416 3 8 3s6.29 3.13 7.288 4.5c-.998 1.37-3.704 4.5-7.288 4.5z" />
              <path d="M8 5.5A2.5 2.5 0 1 0 8 10a2.5 2.5 0 0 0 0-4.5zm0 1A1.5 1.5 0 1 1 8 9a1.5 1.5 0 0 1 0-3z" />
            </svg>
          </span>
        </button>
      ),
    },
  ];

  return (
    <div className="vh-60 d-flex flex-column">
      <Header username="Manjula" onLogout={() => alert("Logout clicked")} />

      <div className="d-flex full-height transparent">
        <div
          className={`border-end sidebar d-none ${
            isCollapsed ? "collapsed" : "expanded"
          }`}
        >
          {/* Sidebar Toggle Button */}
          {/* <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`hover-button-py-3 ${isHovered ? "hovered" : ""}`}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <FaChevronRight color={iconColor} />
            ) : (
              <FaChevronLeft color={iconColor} />
            )}
          </div> */}

          {!isCollapsed && (
            <div className="full-height scrollable-y-auto">
              {currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 border-bottom d-flex flex-column"
                    style={{
                      backgroundColor:
                        selectedTask?.id === task.id ? "#eceef0" : "#fff",
                      cursor: "pointer",
                      borderLeft:
                        selectedTask?.id === task.id
                          ? "3px solid #8529cd"
                          : "3px solid transparent",
                    }}
                    onClick={() => handleTaskSelect(task)}
                    aria-label={`Select task ${task.name}`}
                  >
                    <div
                      className="text-start"
                      style={{
                        color: "#2a2e33",
                      }}
                    >
                      <strong>{task.name}</strong>
                    </div>
                    <div className="text-muted small text-start">
                      {task.assignee}
                    </div>
                    <div className="text-muted small text-start">
                      {new Date(task.creationDate).toDateString()}
                    </div>
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
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1
                        ? "bg-primary text-white"
                        : "bg-white text-primary"
                    }`}
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

        <div
        
          className={`flex-grow-1 ${
            !selectedTask ? "d-flex" : "d-none"
          } flex-column p-2 border-0`}
        >
          <div
            style={{
              alignSelf: "flex-start",
              padding: "5px 0px",
              width: "100%",
            }}
          >
            {/* Header for the Task List */}
            <div
            className="header-title"
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              Error Management
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "5px 0",
                justifyContent: "space-between", // This will push items to extreme ends
                // Ensure the container takes full width
              }}
            >
              <div
className="search-bar"
                style={{
                  position: "relative",
                  width: "320px",
                  maxWidth: "100%",
                  background: "#f1f3f6",
                  borderRadius: "5px",
                  boxShadow: "0 1px 2px rgba(68,84,111,0.04)",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px 12px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#44546f"
                  viewBox="0 0 16 16"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.106a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="assigned"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "1rem",
                    width: "100%",
                    color: "#2a2e33",
                    padding: "6px 0",
                  }}
                  value={""}
                  onChange={() => {}}
                  aria-label="Search tasks"
                />
              </div>
              <button
                style={{
                  background: "#8529cd",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 24px",
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginLeft: "16px",
                  boxShadow: "0 2px 8px rgba(68,84,111,0.08)",
                  cursor: "pointer",
                  transition: "background 0.2s, box-shadow 0.2s",
                  outline: "none",
                }}
                onClick={() => {
                  // TODO: Implement fetch incidents logic here
                  alert("Fetch Incidents clicked!");
                }}
                aria-label="Fetch Incidents"
              >
                Fetch Incidents
              </button>
            </div>
          </div>
          <Box sx={{ height: 800, width: "100%" }}>
            <div
              className="assigned"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "start",
                padding: "10px 0px",
                fontWeight: "bold",
              }}
            >
              Issues assigned to me
            </div>
            <DataGrid
              rows={tasks
                ?.filter((task) => task.assigne !== null)
                .map((task) => ({
                  id: task.id,
                  name: task.name,
                  assignee: task.assignee,
                  creationDate: task?.creationDate,
                  processName: task.processName,
                  priority: task.priority,
                }))}
              columns={columns}
              hideFooterPagination
              pageSize={6}
              rowsPerPageOptions={[6]}
              onRowClick={(params) =>
                handleTaskSelect(tasks.find((t) => t.id === params.id))
              }
              getRowClassName={(params) =>
                selectedTask?.id === params.id
                  ? "Mui-selected"
                  : params.indexRelativeToCurrentPage % 2 === 0
                  ? "even-row"
                  : "odd-row"
              }
              sx={{
                cursor: "pointer",
                "& .Mui-selected": {
                  backgroundColor: "#eceef0 !important",
                },
                "& .even-row": {
                  backgroundColor: "#f9fafb",
                },
                "& .odd-row": {
                  backgroundColor: "#f1f3f6",
                },
                // Remove outer borders
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                },
                "& .MuiDataGrid-footerContainer": {
                  border: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  border: "none",
                },
                "& MuiDataGrid-mainContent": {
                  border: "none",
                },
              }}
            />
          </Box>
          <Box sx={{ marginTop: "80px" }}>
            <div
              className="assigned"
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "start",
                padding: "10px 0px",
                fontWeight: "bold",
              }}
            >
              Issues assigned to my group
            </div>
            {console.log(tasks)}
            {console.log("Assigned to me rows:", tasks
  ?.filter((task) => task.assigne !== null)
  .map((task) => ({
    id: task.id,
    name: task.name,
    assignee: task.assigne,
    creationDate: task?.creationDate,
    processName: task.processName,
    priority: task.priority,
  })))
}
            <DataGrid 
            className="assigned"
              rows={tasks
                .filter((task) => task.assigne === null)
                .map((task) => ({
                  id: task.id,
                  name: task.name,
                  assignee: task.assignee,
                  creationDate: task?.creationDate,
                  processName: task.processName,
                  priority: task.priority,
                }))}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
              onRowClick={(params) =>
                handleTaskSelect(tasks.find((t) => t.id === params.id))
              }
              hideFooterPagination
              getRowClassName={(params) =>
                selectedTask?.id === params.id
                  ? "Mui-selected"
                  : params.indexRelativeToCurrentPage % 2 === 0
                  ? "even-row"
                  : "odd-row"
              }
              sx={{
                cursor: "pointer",
                "& .Mui-selected": {
                  backgroundColor: "#eceef0 !important",
                },
                "& .even-row": {
                  backgroundColor: "#f9fafb",
                },
                "& .odd-row": {
                  backgroundColor: "#f1f3f6",
                },
                // Remove outer borders
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                },
                "& .MuiDataGrid-footerContainer": {
                  border: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  border: "none",
                },
                "& MuiDataGrid-mainContent": {
                  border: "none",
                },
              }}
            />
          </Box>
        </div>

        <Card
          className={`flex-grow-1 ${
            selectedTask ? "d-flex" : "d-none"
          } flex-column p-2 border-0`}
        >
          {selectedTask ? (
            <TaskDetails
              selectedTask={selectedTask}
              onClaimChange={handleClaimChange}
              onAddJiraComment={onAddJiraComment}
              onAddComment={onAddComment}
            />
          ) : (
            <p className="text-center mt-4">Select a task to view details</p>
          )}
        </Card>
      </div>

      {/* Floating Action Button */}
      {selectedTask && selectedTask.assignee && (
        <button
          className="floating-action-btn"
          onClick={async () => {
            if (!selectedTask?.id) return;

            const Payload = {
              action: "complete",
              JiraComments: newJiraComments || [],
              comments: newComments || [],
            };

            setSending(true);

            try {
              const token = keycloak.token; // Adjust if you use another storage

              const response = await fetch(
                // `${complete_url}/${selectedTask?.id}/completion`,
                `${complete_url}/tasks/${selectedTask?.id}/complete`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(Payload),
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                  errorData.message ||
                    "Something went wrong while submitting the task."
                );
              }

              // If response is OK
              Swal.fire({
                title: "Submitted!",
                text: "Your Task has been submitted Successfully",
                icon: "success",
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.isConfirmed && selectedTask) {
                  setTasks((prevTasks) => {
                    const updatedTasks = prevTasks.filter(
                      (task) => task.id !== selectedTask.id
                    );
                    const updatedTotalPages = Math.ceil(
                      updatedTasks.length / tasksPerPage
                    );
                    if (currentPage > updatedTotalPages) {
                      setCurrentPage(
                        updatedTotalPages > 0 ? updatedTotalPages : 1
                      );
                    }
                    return updatedTasks;
                  });
                  setSelectedTask(null);
                }
              });
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text:
                  error.message ||
                  "Something went wrong while submitting the task.",
                icon: "error",
                confirmButtonText: "OK",
              });
            } finally {
              setSending(false);
            }
          }}
          title="Complete Task"
          aria-label="Complete Task"
        >
          {sending ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              submitting...
            </>
          ) : (
            "Complete"
          )}
        </button>
      )}
    </div>
  );
};

export default InboxPage;
