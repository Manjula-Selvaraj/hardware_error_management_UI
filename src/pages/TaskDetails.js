import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './styles.css';
import ProjectDetails from './ProjectDetails';

const TaskDetails = ({ selectedTask: initialSelectedTask, onClaimChange }) => {
  const [selectedTask, setSelectedTask] = useState(initialSelectedTask || {});
  const [tabs, setTabs] = useState(initialSelectedTask?.tabs || []);
  const [activeTab, setActiveTab] = useState('');
  const [isClaimed, setisClaim] = useState(initialSelectedTask?.assignie || false);

  useEffect(() => {
    if (initialSelectedTask) {
      setSelectedTask(initialSelectedTask);
      setTabs(initialSelectedTask.tabs || []);
      setisClaim(initialSelectedTask.assignie || false);
      if (initialSelectedTask.tabs?.length > 0) {
        setActiveTab(initialSelectedTask.tabs[0]);
      }
    }
  }, [initialSelectedTask]);

  const handleClaimToggle = () => {
    const newClaimStatus = !isClaimed;
    setisClaim(newClaimStatus);
    if (onClaimChange && selectedTask.id) {
      onClaimChange(selectedTask.id, newClaimStatus);
    }
  };

  const handleChange = (event, newActiveTab) => {
    if (newActiveTab !== null) {
      setActiveTab(newActiveTab);
    }
  };

  return (
    <Card className="vh-100 d-flex flex-column p-1 scrollable-container" >
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
            <div className="text-start margin">
              {activeTab === "Grafana" && <h4>This is the Grafana tab</h4>}
              {activeTab === "Pager" && <h4>This is the Pager tab</h4>}
              {activeTab === "SRE" && <h4>This is the SRE tab</h4>}
              {activeTab === "TAM" && <h4>This is the TAM tab</h4>}
              {activeTab === "BMAaS" && <h4>This is the BMAAS tab</h4>}
              {activeTab === "DC" && <h4>This is the DC tab</h4>}
              {activeTab === "Jira" && <ProjectDetails selectedTask={selectedTask} />}
            </div>
          </Card>
        </Card>
      </Row>

      <Row className="vh-50 d-flex flex-column p-3">
        <Card className="vh-50 d-flex flex-column p-0">
          <CardHeader style={{ color: "black", fontSize: "20px" }}>
            <strong>User Form</strong>
          </CardHeader>
          <CardBody>
            {/* User Form Content */}
          </CardBody>
        </Card>
      </Row>
    </Card>
  );
};

export default TaskDetails;
