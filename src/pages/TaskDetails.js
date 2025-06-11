import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, Col, Row } from "react-bootstrap";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import "./styles.css";
import JiraBoard from "./TAB_Content/JiraBoard";
import SRE_Details from "./TAB_Content/SRE_Details";
import TAM_Details from "./TAB_Content/TAM_Details";
import DC_Details from "./TAB_Content/DC_Details";
import BMAaS_Details from "./TAB_Content/BMAaS_Details";
import UserForm from "./TAB_Content/UserForm";
import Swal from "sweetalert2";
import Spinner from "react-bootstrap/Spinner";
import { AuthContext } from "../AuthProvider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import "../App.scss";

const TaskDetails = ({
  selectedTask: initialSelectedTask,
  onClaimChange,
  onAddJiraComment,
  onAddComment,
}) => {
  const { keycloak } = useContext(AuthContext);

  const [selectedTask, setSelectedTask] = useState(initialSelectedTask || {});
  const [tabs, setTabs] = useState(initialSelectedTask?.tabs || []);
  const [activeTab, setActiveTab] = useState("");
  const [isClaimed, setIsClaimed] = useState(
    initialSelectedTask?.assignee || false
  );
  const [formResponses, setFormResponses] = useState({});
  const [formSubmittedStatus, setFormSubmittedStatus] = useState({}); // ✅ per-task submission tracking
  //  const [isClaimed, setisClaim] = useState(initialSelectedTask?.assignee || false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialSelectedTask) {
      setSelectedTask(initialSelectedTask);
      setTabs(initialSelectedTask.tabs || []);
      setIsClaimed(initialSelectedTask.assignee || false);
      console.log("inisde taskdetails");
      console.log(initialSelectedTask);
      let tabs = [];
      if (initialSelectedTask != null) {
        if (initialSelectedTask.taskDefinitionId === "Task_SRE_Team") {
          tabs = ["SRE", "Pager", "Jira"];
        }
      }
      initialSelectedTask.tabs = tabs;
      if (
        initialSelectedTask.title &&
        initialSelectedTask.tabs?.includes(initialSelectedTask.title)
      ) {
        setActiveTab(initialSelectedTask.title);
      } else {
        setActiveTab(initialSelectedTask.tabs[0] || "");
      }
    }
  }, [initialSelectedTask]);

  const handleClaimToggle = async () => {
    const newClaimStatus = !isClaimed;
    const token = keycloak?.token;

    if (!selectedTask?.id) return;

    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "Authentication token is missing. Please login again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      setLoading(true);

      try {
        let response;
        if (!newClaimStatus) {
          // UNCLAIM TASK
          response = await fetch(
            `http://localhost:7259/api/tasklist/v1/tasks/${selectedTask.id}/assignee`,
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
          }).then((result) => {
            if (result.isConfirmed) {
              setIsClaimed(newClaimStatus);
              onClaimChange(selectedTask.id, newClaimStatus);
            }
          });
        } else {
          // CLAIM TASK
          response = await fetch(
            `http://localhost:7259/api/tasklist/v1/tasks/${selectedTask.id}/assign`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
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
          }).then((result) => {
            if (result.isConfirmed) {
              setIsClaimed(newClaimStatus);
              onClaimChange(selectedTask.id, newClaimStatus);
            }
          });
        }
      } catch (error) {
        Swal.fire(
          "Error",
          newClaimStatus
            ? "Failed to Claim the task"
            : "Failed to Unclaim the task",
          "Something went wrong Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event, newActiveTab) => {
    if (newActiveTab !== null) {
      setActiveTab(newActiveTab);
    }
  };

  const handleSubmit = (tab, formData) => {
    setFormResponses((prev) => ({ ...prev, [tab]: formData }));
    if (selectedTask?.id) {
      setFormSubmittedStatus((prev) => ({
        ...prev,
        [selectedTask.id]: true,
      }));
    }
  };

  const isFormSubmittedForTask =
    selectedTask?.id && formSubmittedStatus[selectedTask.id];

  const handleJiraCommentsUpdate = (updatedComments) => {
    if (onAddJiraComment) {
      onAddJiraComment(updatedComments);
    }
  };

  const handleCommentsUpdate = (updatedComments) => {
    if (onAddComment) {
      onAddComment(updatedComments);
    }
  };

  //  Tab component mapping
  const tabComponentMap = {
    Grafana: () => <h4>This is the Grafana tab</h4>,
    Pager: () => (
      <h4>
        {JSON.parse(
          selectedTask.variables.find((v) => v.name === "pagerResponse")?.value
        )}
      </h4>
    ),
    SRE: () => (
      <SRE_Details
        selectedTask={selectedTask}
        activeTab="SRE"
        formData={formResponses["SRE"]}
      />
    ),
    TAM: () => (
      <TAM_Details
        selectedTask={selectedTask}
        activeTab="TAM"
        formData={formResponses["TAM"]}
      />
    ),
    BMAaS: () => (
      <BMAaS_Details
        selectedTask={selectedTask}
        activeTab="BMAaS"
        formData={formResponses["BMAaS"]}
      />
    ),
    DC: () => (
      <DC_Details
        selectedTask={selectedTask}
        activeTab="DC"
        formData={formResponses["DC"]}
        onCommentsUpdate={handleCommentsUpdate}
      />
    ),
    Jira: () => (
      <JiraBoard
        selectedTask={selectedTask}
        onCommentsUpdate={handleJiraCommentsUpdate}
      />
    ),
  };

  // Import MUI Tabs components

  return (
    <Card className="d-flex flex-column p-1 border-0">
      <Row>
        <Col md={10} className="text-start">
          <strong
            style={{
              fontFamily: "Roboto",
            }}
          >
            {selectedTask.name}
          </strong>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            {new Date(selectedTask.creationDate).toDateString()}
          </div>
        </Col>
        <Col md={2} className="text-end">
          <button
            className={`btn`}
            onClick={handleClaimToggle}
            style={{ backgroundColor: "#8529cd", color: "white" }}
            aria-label={isClaimed ? "Unclaim Task" : "Claim Task"}
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  className="me-2"
                />
                Loading...
              </>
            ) : isClaimed ? (
              "Unclaim"
            ) : (
              "Claim"
            )}
          </button>
        </Col>
      </Row>

      <Row className="vh-50 d-flex flex-column p-2 border-0">
        <Card className="vh-50 d-flex flex-column p-0 mt-1 border-0">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(event, newValue) => setActiveTab(newValue)}
              aria-label="Tabs"
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                style: { backgroundColor: "#8529cd" },
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  label={tab}
                  value={tab}
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    color: activeTab === tab ? "#8529cd" : "inherit",
                    ...(activeTab === tab && {
                      "&.Mui-selected": {
                        color: "#8529cd",
                      },
                      color: "#8529cd",
                    }),
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Card className="vh-60 d-flex flex-column p-1 mt-1 mb-1 border-0">
            <div
              className="text-start vh-60"
              style={{
                marginTop: ["SRE", "TAM", "BMAaS", "DC", "Jira"].includes(
                  activeTab
                )
                  ? "5px"
                  : "25px",
                marginLeft: ["SRE", "TAM", "BMAaS", "DC", "Jira"].includes(
                  activeTab
                )
                  ? "0px"
                  : "25px",
              }}
            >
              {tabComponentMap[activeTab] ? (
                tabComponentMap[activeTab]()
              ) : (
                <p style={{ color: "red" }}>
                  Component not found for tab: {activeTab}
                </p>
              )}
            </div>
          </Card>
        </Card>
      </Row>

      {selectedTask.title &&
        ["SRE", "DC", "TAM", "BMAaS"].includes(selectedTask.title) &&
        selectedTask.title === activeTab &&
        !isFormSubmittedForTask && (
          <Row className="vh-50 d-flex flex-column p-2">
            <Card className="vh-50 d-flex flex-column p-0">
              <CardHeader style={{ color: "black", fontSize: "20px" }}>
                <strong>User Form</strong>
              </CardHeader>
              <UserForm
                onSubmit={handleSubmit}
                activeTab={activeTab}
                selectedTask={selectedTask}
              />
            </Card>
          </Row>
        )}
    </Card>
  );
};

export default TaskDetails;
