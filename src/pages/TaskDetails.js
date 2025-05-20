import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './styles.css';
import JiraBoard from './TAB_Content/JiraBoard';
import SRE_Details from './TAB_Content/SRE_Details';
import TAM_Details from './TAB_Content/TAM_Details';
import DC_Details from './TAB_Content/DC_Details';
import BMAaS_Details from './TAB_Content/BMAaS_Details';
import UserForm from './TAB_Content/UserForm';
import Swal from 'sweetalert2';
import axios from 'axios';

const TaskDetails = ({ selectedTask: initialSelectedTask, onClaimChange, onAddJiraComment, onAddComment }) => {
  const [selectedTask, setSelectedTask] = useState(initialSelectedTask || {});
  const [tabs, setTabs] = useState(initialSelectedTask?.tabs || []);
  const [activeTab, setActiveTab] = useState('');
  const [isClaimed, setIsClaimed] = useState(initialSelectedTask?.assignie || false);
  const [formResponses, setFormResponses] = useState({});
  const [formSubmittedStatus, setFormSubmittedStatus] = useState({}); // ✅ per-task submission tracking



  useEffect(() => {
    if (initialSelectedTask) {
      setSelectedTask(initialSelectedTask);
      setTabs(initialSelectedTask.tabs || []);
      setIsClaimed(initialSelectedTask.assignie || false);
      if (initialSelectedTask.title && initialSelectedTask.tabs?.includes(initialSelectedTask.title)) {
        setActiveTab(initialSelectedTask.title);
      } else {
        setActiveTab(initialSelectedTask.tabs[0] || '');
      }
    }
  }, [initialSelectedTask]);



  const handleClaimToggle = () => {
    const newClaimStatus = !isClaimed;

    if (!newClaimStatus) {
      // Unclaim task
      axios
        .delete(`http://localhost:8080/v2/user-tasks/${selectedTask.id}/assignee`)
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "This Task has been Unclaimed",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            if (result.isConfirmed && selectedTask.id) {
              setIsClaimed(newClaimStatus); // ✅ Set state only after success
              onClaimChange(selectedTask.id, newClaimStatus);
            }
          });
        })
        .catch((err) => {
          Swal.fire("Error", "Failed to unclaim the task", "error");
        });
    } else {
      // Claim task
      axios
        .post(`/v2/user-tasks/${selectedTask.id}/assignment`)
        .then((res) => {
          Swal.fire({
            title: "Success!",
            text: "This Task has been Claimed",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            if (result.isConfirmed && selectedTask.id) {
              setIsClaimed(newClaimStatus); // ✅ Set state only after success
              onClaimChange(selectedTask.id, newClaimStatus);
            }
          });
        })
        .catch((err) => {
          Swal.fire("Error", "Failed to claim the task", "error");
        });
    }
  };


  const handleChange = (event, newActiveTab) => {
    if (newActiveTab !== null) {
      setActiveTab(newActiveTab);
    }
  };

  const handleSubmit = (tab, formData) => {
    setFormResponses(prev => ({ ...prev, [tab]: formData }));
    if (selectedTask?.id) {
      setFormSubmittedStatus(prev => ({
        ...prev,
        [selectedTask.id]: true
      }));
    }
  };

  const isFormSubmittedForTask = selectedTask?.id && formSubmittedStatus[selectedTask.id];

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

  // ✅ Tab component mapping
  const tabComponentMap = {
    Grafana: () => <h4>This is the Grafana tab</h4>,
    Pager: () => <h4>This is the Pager tab</h4>,
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
    )
  };

  return (
    <Card className="vh-100 d-flex flex-column p-1 scrollable-container">
      <Row>
        <Col md={10} className="mb-2 mt-3 text-start">
          <strong className="mx-4">{selectedTask.title}</strong>
          <strong>{selectedTask.date}</strong>
        </Col>
        <Col md={2} className="mb-2 mt-2">
          <button
            className={`btn ${isClaimed ? 'btn-danger' : 'btn-success'}`}
            onClick={handleClaimToggle}
            aria-label={isClaimed ? "Unclaim Task" : "Claim Task"}
          >
            {isClaimed ? 'Unclaim' : 'Claim'}
          </button>
        </Col>
      </Row>

      <Row className="vh-50 d-flex flex-column p-3">
        <Card className="vh-50 d-flex flex-column p-1 mt-1">
          <ToggleButtonGroup
            color="primary"
            value={activeTab}
            exclusive
            onChange={handleChange}
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <ToggleButton key={tab} value={tab} className="boldtext tabs-container">
                {tab}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Card className="vh-50 d-flex flex-column p-1 mt-1 mb-1">
            <div
              className="text-start"
              style={{
                marginTop: ["SRE", "TAM", "BMAaS", "DC"].includes(activeTab) ? "5px" : "25px",
                marginLeft: ["SRE", "TAM", "BMAaS", "DC"].includes(activeTab) ? "0px" : "25px"
              }}
            >
              {tabComponentMap[activeTab] ? (
                tabComponentMap[activeTab]()
              ) : (
                <p style={{ color: 'red' }}>Component not found for tab: {activeTab}</p>
              )}

            </div>
          </Card>
        </Card>
      </Row>

      {selectedTask.title &&
        ["SRE", "DC", "TAM", "BMAaS"].includes(selectedTask.title) &&
        selectedTask.title === activeTab &&
        !isFormSubmittedForTask && (
          <Row className="vh-50 d-flex flex-column p-3">
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
