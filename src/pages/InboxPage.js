import React, { useCallback, useEffect, useState, useContext } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { FaMagnifyingGlass, FaRegEye } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import TaskDetails from "./TaskDetails";
import Swal from "sweetalert2";
import { Card } from "react-bootstrap";
import { AuthContext } from "../AuthProvider";
import Spinner from "react-bootstrap/Spinner";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

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
  const [idForPopup, setIdForPopup] = useState(null);
  const [isCompleteButtonEnabled, setIsCompleteButtonEnabled] = useState(false);
  const [checkboxData, setCheckboxData] = useState([]);
  const [troubleshootText, setTroubleshootText] = useState("");
  const [isTroubleshootSuccessful, setIsTroubleshootSuccessful] =
    useState(false);
  const [tamPayload, setTamPayload] = useState({});

  const handleTaskSelect = async (task) => {
    setSelectedTask(null); // Reset first to force re-render
    const tasksTemp = tasks.find((t) => t.id === task.id);

    try {
      await keycloak.updateToken(60);
      const token = keycloak.token;

      const response = await fetch(`${base_url}/${task.id}/variable/search`, {
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
        ...tasksTemp,
        variables, // inject variables into the task object
      });
    } catch (error) {
      console.error("Failed to load task variables:", error);
    }
  };

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

      setTasks([]);
      setTimeout(() => {
        setTasks(Array.isArray(data) ? [...data] : []);
      }, 500);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  console.log("tasks", tasks);

  useEffect(() => {
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

  const headers = {
    Authorization: `Bearer ${keycloak?.token}`,
    "Content-Type": "application/json",
  };

  const handleUnClaimTask = async (taskId) => {
    let response = await fetch(
      `http://localhost:7259/api/incident/v1/task/${taskId}/assignee`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) throw new Error("Failed to unclaim the task");

    Swal.fire({
      title: "Success!",
      text: "This Task has been Unclaimed",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {});
    setTimeout(() => {
      fetchTasks();
    }, 3000);
  };

  const handleClaimTask = async (taskId) => {
    let response = await fetch(
      `http://localhost:7259/api/incident/v1/task/${taskId}/assign`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keycloak?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignee: keycloak.tokenParsed.preferred_username,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to claim the task");

    Swal.fire({
      title: "Success!",
      text: "This Task has been Claimed",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {});
    setTimeout(() => {
      fetchTasks();
    }, 3000);
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "Serial No",
      width: 100,
      valueGetter: (value, row) => {
        if (!row || !row.id) return "";
        // Find the index of the row in the tasks array and add 1 for serial number
        const index = tasks.findIndex((t) => t.id === row.id);
        return index >= 0 ? index + 1 : "";
      },
    },
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Task Name", width: 280 },
    {
      field: "processName",
      headerName: "Process Name",
      width: 280,
      renderCell: (params) => {
        return (
          <div
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
      width: 180,
      valueGetter: (value, row) =>
        row.creationDate
          ? new Date(row.creationDate || "").toLocaleString()
          : "",
    },
    { field: "assigne", headerName: "Assignee", width: 150 },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
    },
    {
      field: "action",
      headerName: "View",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div>
          <button
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "5px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              //params.api.setRowId(params.id);
              setIdForPopup(idForPopup === params.id ? null : params.id);
            }}
          >
            <CiMenuKebab />
          </button>
          {idForPopup === params.id && (
            <div
              style={{
                position: "absolute",
                background: "white",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                zIndex: 1000,
                // right: "65px",
                top: "70px",
                width: "120px",
              }}
            >
              <button
                style={{
                  // display: 'block',
                  width: "100%",
                  padding: "1px 12px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTaskSelect(params.row);
                  setIdForPopup(null); // Close the popup after selecting the task
                }}
              >
                <FaRegEye /> View
              </button>
              <button
                style={{
                  // display: 'block',
                  width: "100%",
                  padding: "1px 16px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    params?.row?.assignee ===
                    keycloak?.tokenParsed?.preferred_username
                  )
                    handleUnClaimTask(params.row.id);
                  else handleClaimTask(params.row.id);

                  setIdForPopup(null); // Close the popup after selecting the task
                }}
              >
                <IoMdCheckmarkCircleOutline />{" "}
                {params?.row?.assignee ===
                keycloak?.tokenParsed?.preferred_username
                  ? "Unclaim"
                  : "Claim"}
              </button>
            </div>
          )}
        </div>
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
                <FaMagnifyingGlass />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "1rem",
                    width: "100%",
                    color: "#2a2e33",
                    padding: "6px 0",
                    marginLeft: "8px",
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
          <Box sx={{ height: "350px", width: "100%" }}>
            <div
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
                ?.filter(
                  (task) =>
                    task.assignee === keycloak?.tokenParsed?.preferred_username
                )
                .map((task) => ({
                  id: task.id,
                  name: task.name,
                  assignee: task.assignee,
                  creationDate: task?.creationDate,
                  processName: task.processName,
                  priority: task.priority,
                  assigne: task.assigne,
                }))}
              columns={columns}
              hideFooterPagination
              pageSize={6}
              rowsPerPageOptions={[6]}
              // onRowClick={(params) =>
              //   handleTaskSelect(tasks.find((t) => t.id === params.id))
              // }
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
                  position: "relative",
                },
                "& .odd-row": {
                  backgroundColor: "#f1f3f6",
                  position: "relative",
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
          <Box sx={{ marginTop: "80px", height: "300px", width: "100%" }}>
            <div
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
            <DataGrid
              rows={tasks
                .filter((task) => !task.assignee)
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
              // onRowClick={(params) =>
              //   handleTaskSelect(tasks.find((t) => t.id === params.id))
              // }
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
              handleCloseTask={() => {
                setSelectedTask(null);
              }}
              handleEnableSubmitButton={(
                checkboxData,
                troubleshootText,
                isTroubleshootSuccessful
              ) => {
                if (selectedTask.taskDefinitionId === "Task_SRE_Team") {
                  setIsCompleteButtonEnabled(true);
                  setCheckboxData(checkboxData);
                  setTroubleshootText(troubleshootText);
                  setIsTroubleshootSuccessful(isTroubleshootSuccessful);
                }
              }}
              handleTamPayload={(tamPayload) => {
                if (
                  selectedTask.taskDefinitionId === "Task_Orchestration_By_TAM"
                ) {
                  setIsCompleteButtonEnabled(true);
                  setTamPayload(tamPayload);
                }
              }}
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
          disabled={!isCompleteButtonEnabled}
          style={{
            backgroundColor: isCompleteButtonEnabled ? "#8529cd" : "#ccc",
            color: "white",
            borderRadius: "6px",
            fontSize: "16px",
          }}
          onClick={async () => {
            if (!selectedTask?.id) return;

            let payload = {};
            const incidentData =
              selectedTask?.variables?.find(
                (data) => data.name === "incidentData"
              ) || {};

            if (selectedTask.taskDefinitionId === "Task_Orchestration_By_TAM") {
              payload = tamPayload;
            } else {
              payload = {
                incidentData: {
                  errorDetails: {
                    title: JSON.parse(incidentData?.previewValue)?.errorDetails
                      ?.title,
                    description: JSON.parse(incidentData?.previewValue)
                      ?.errorDetails?.description,
                  },
                  investigationDetails: JSON.parse(incidentData?.previewValue)
                    ?.investigationDetails,
                  playBook: checkboxData,
                  successfulTroubleshoot: isTroubleshootSuccessful,
                  troubleshootInfo: troubleshootText || "",
                },
                userInfo: {
                  username: keycloak?.tokenParsed?.preferred_username || "",
                  email: keycloak?.tokenParsed?.email || "",
                },
              };
            }

            // const Payload = {
            //   action: "complete",
            //   JiraComments: newJiraComments || [],
            //   comments: newComments || [],
            // };

            setSending(true);

            try {
              const token = keycloak.token; // Adjust if you use another storage

              const response = await fetch(
                `${complete_url}/task/${selectedTask?.id}/complete`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(payload),
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
