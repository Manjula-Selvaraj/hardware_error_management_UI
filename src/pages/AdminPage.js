import React, { useCallback, useEffect, useState, useContext } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import { AuthContext } from "../AuthProvider";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const AdminPage = () => {
  const { keycloak } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [idForPopup, setIdForPopup] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await keycloak.updateToken(60);
        const token = keycloak.token;
        const response = await fetch(
          `http://localhost:7259/api/incident/v1/task/audit`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

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

  const columns = [
    {
      field: "serialNo",
      headerName: "Serial No",
      flex: 1,
      valueGetter: (value, row) => {
        if (!row || !row.id) return "";
        const index = tasks.findIndex((t) => t.id === row.id);
        return index >= 0 ? index + 1 : "";
      },
    },
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Task Name", flex: 1 },
    // {
    //   field: "processName",
    //   headerName: "Process Name",
    //   width: 280,
    //   renderCell: (params) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         width: "100%",
    //         height: "100%",
    //       }}
    //     >
    //       <div
    //         style={{
    //           display: "inline-block",
    //           background: "#e0e7ff",
    //           color: "#3730a3",
    //           borderRadius: "5px",
    //           padding: "0px 10px",
    //           fontSize: "0.95em",
    //           fontWeight: 500,
    //           height: "30px",
    //           lineHeight: "30px",
    //         }}
    //       >
    //         {params.row.processName}
    //       </div>
    //     </div>
    //   ),
    // },
    {
      field: "creationDate",
      headerName: "Created At",
      flex: 1,
      valueGetter: (value, row) =>
        row.creationDate ? new Date(row.creationDate).toLocaleString() : "",
    },
    {
      field: "claimedDate",
      headerName: "Claimed At",
      flex: 1,
      valueGetter: (value, row) =>
        row.claimedDate ? new Date(row.claimedDate).toLocaleString() : "",
    },
    {
      field: "completedDate",
      headerName: "Completed At",
      flex: 1,
      valueGetter: (value, row) =>
        row.completedDate ? new Date(row.completedDate).toLocaleString() : "",
    },
    { field: "assignee", headerName: "Assignee", flex: 1 },
    {
      field: "taskState",
      headerName: "Task State",
      flex: 1,
    },
    {
      field: "durationInSeconds",
      headerName: "Duration",
      flex: 1,
      valueGetter: (value, row) => {
        if (!row.durationInSeconds && row.durationInSeconds !== 0) return "";
        const totalSeconds = row.durationInSeconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        let result = "";
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0 || hours > 0) result += `${minutes}m `;
        result += `${seconds}s`;
        return result.trim();
      },
    },
    // {
    //   field: "action",
    //   headerName: "Actions",
    //   width: 80,
    //   sortable: false,
    //   filterable: false,
    //   renderCell: (params) => (
    //     <div>
    //       <button
    //         style={{
    //           background: "transparent",
    //           border: "none",
    //           cursor: "pointer",
    //           padding: "5px",
    //         }}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           setIdForPopup(idForPopup === params.id ? null : params.id);
    //         }}
    //       >
    //         <CiMenuKebab />
    //       </button>
    //       {idForPopup === params.id && (
    //         <div
    //           style={{
    //             position: "absolute",
    //             background: "white",
    //             boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    //             borderRadius: "4px",
    //             display: "flex",
    //             flexDirection: "column",
    //             zIndex: 1000,
    //             right: "65px",
    //             top: "45px",
    //             width: "120px",
    //           }}
    //         >
    //           <button
    //             style={{
    //               width: "100%",
    //               padding: "8px 16px",
    //               border: "none",
    //               background: "none",
    //               cursor: "pointer",
    //               display: "flex",
    //               alignItems: "center",
    //               gap: "8px",
    //             }}
    //             onClick={() => {
    //               // Implement view action
    //               setSelectedTask(params.row);
    //             }}
    //           >
    //             <FaRegEye /> View
    //           </button>
    //           <button
    //             style={{
    //               width: "100%",
    //               padding: "8px 16px",
    //               border: "none",
    //               background: "none",
    //               cursor: "pointer",
    //               display: "flex",
    //               alignItems: "center",
    //               gap: "8px",
    //             }}
    //             onClick={() => {
    //               // Implement manage action
    //             }}
    //           >
    //             <IoMdCheckmarkCircleOutline /> Manage
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="vh-100 d-flex flex-column">
      <Header username="Admin" onLogout={() => alert("Logout clicked")} />

      <div className="d-flex flex-column p-4">
        {/* Header Section */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              marginBottom: "16px",
            }}
          >
            Error Management - Supervisor
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "320px",
                background: "#f1f3f6",
                borderRadius: "5px",
                boxShadow: "0 1px 2px rgba(68,84,111,0.04)",
                display: "flex",
                alignItems: "center",
                padding: "2px 12px",
              }}
            >
              <FaMagnifyingGlass style={{ color: "#44546f" }} />
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
                boxShadow: "0 2px 8px rgba(68,84,111,0.08)",
                cursor: "pointer",
                transition: "background 0.2s, box-shadow 0.2s",
                outline: "none",
              }}
              onClick={() => {
                // Implement refresh functionality
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Table Section */}
        <Box sx={{ height: 800, width: "100%" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "start",
              padding: "10px 0px",
              fontWeight: "bold",
            }}
          >
            All Tasks
          </div>
          <DataGrid
            rows={tasks.map((task) => ({
              id: task.taskId,
              name: task?.name,
              assignee: task.assignedTo,
              creationDate: task?.createdAt,
              claimedDate: task?.claimedAt,
              completedDate: task.completedAt,
              taskState: task.taskState,
              durationInSeconds: task?.durationInSeconds,
            }))}
            columns={columns}
            hideFooterPagination
            getRowClassName={(params) =>
              selectedTask?.id === params.id
                ? "Mui-selected"
                : params.indexRelativeToCurrentPage % 2 === 0
                ? "even-row"
                : "odd-row"
            }
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#CBBAF3",
                color: "black",
              },
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
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                backgroundColor: "#f8fafc",
                borderBottom: "2px solid #e2e8f0",
              },
              "& .MuiDataGrid-footerContainer": {
                border: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f1f5f9",
              },
            }}
          />
        </Box>
      </div>
    </div>
  );
};

export default AdminPage;
