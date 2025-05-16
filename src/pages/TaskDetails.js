import React, { useEffect, useState } from 'react';
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
    setIsClaimed(newClaimStatus);
    if (onClaimChange && selectedTask.id) {
      onClaimChange(selectedTask.id, newClaimStatus);
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
    console.log("Updated comments from child:", updatedComments);
    // You can store them in state or do anything else with them

    // Notify parent
    if (onAddJiraComment) {
      onAddJiraComment(updatedComments);
    }
  };

  const handleCommentsUpdate = (updatedComments) => {
    console.log("Received comment from DC_Details:", updatedComments);
    if (onAddComment) {
      onAddComment(updatedComments);
    }
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
              {activeTab === "Grafana" && <h4>This is the Grafana tab</h4>}
              {activeTab === "Pager" && <h4>This is the Pager tab</h4>}
              {activeTab === "SRE" && (
                <SRE_Details
                  selectedTask={selectedTask}
                  activeTab="SRE"
                  formData={formResponses["SRE"]}
                />
              )}
              {activeTab === "TAM" && (
                <TAM_Details
                  selectedTask={selectedTask}
                  activeTab="TAM"
                  formData={formResponses["TAM"]}
                />
              )}
              {activeTab === "BMAaS" && (
                <BMAaS_Details
                  selectedTask={selectedTask}
                  activeTab="BMAaS"
                  formData={formResponses["BMAaS"]}
                />
              )}
              {activeTab === "DC" && (
                <DC_Details
                  selectedTask={selectedTask}
                  activeTab="DC"
                  formData={formResponses["DC"]}
                  onCommentsUpdate={handleCommentsUpdate}
                />
              )}
              {activeTab === "Jira" &&
                <JiraBoard selectedTask={selectedTask} onCommentsUpdate={handleJiraCommentsUpdate} />}
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
