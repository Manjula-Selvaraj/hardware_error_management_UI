import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import './styles.css';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const TaskDetails = ({ selectedTask: initialSelectedTask }) => {
    const [selectedTask, setSelectedTask] = useState(initialSelectedTask || {});
    const [tabs, setTabs] = useState(initialSelectedTask?.tabs || []);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        if (initialSelectedTask) {
            setSelectedTask(initialSelectedTask);
            setTabs(initialSelectedTask.tabs || []);

            if (initialSelectedTask.tabs?.length > 0) {
                setActiveTab(initialSelectedTask.tabs[0]);
            }
        }
    }, [initialSelectedTask]);

    const handleChange = (event, newActiveTab) => {
        if (newActiveTab !== null) {
            setActiveTab(newActiveTab);
        }
    };

    return (
        <Card className="vh-100 d-flex flex-column p-1">
            <Row>
                <Col md={10} className="mb-2 mt-3 text-start">
                    <strong className="mx-4">{selectedTask.title}</strong>
                    <strong>{selectedTask.date}</strong>
                </Col>
                <Col md={2} className="mb-2 mt-2">
                    <button 
                        className={`btn ${selectedTask.assignie ? 'btn-danger' : 'btn-success'}`}
                        aria-label={selectedTask.assignie ? "Unclaim Task" : "Claim Task"}
                    >
                        {selectedTask.assignie ? 'Unclaim' : 'Claim'}
                    </button>
                </Col>
            </Row>

            <Row className="vh-50 d-flex flex-column p-3">
                <Card className="vh-50 d-flex flex-column p-1">
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

                    <div className="text-start margin">
                        {activeTab === "Grafana" && <h4>This is the Grafana tab</h4>}
                        {activeTab === "Pager" && <h4>This is the Pager tab</h4>}
                        {activeTab === "SRE" && <h4>This is the SRE tab</h4>}
                        {activeTab === "TAM" && <h4>This is the TAM tab</h4>}
                        {activeTab === "BMAaS" && <h4>This is the BMAAS tab</h4>}
                        {activeTab === "DC" && <h4>This is the DC tab</h4>}
                        {activeTab === "Jira" && <h4>This is the Jira tab</h4>}
                    </div>
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
