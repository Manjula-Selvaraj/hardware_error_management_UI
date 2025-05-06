import React, { use, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import './styles.css';
import jsonData from './jsonData.json';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ProjectDetails from './ProjectDetails';

const TaskDetails = ({ selectedTask: initialSelectedTask, onClaimChange}) => {
    const [selectedTask, setSelectedTask] = useState(initialSelectedTask || {});
    const [tabs, setTabs] = useState(initialSelectedTask?.tabs || []);
    const [activeTab, setActiveTab] = useState('');
    const [claim, setClaim] = useState(initialSelectedTask?.assignie || false);

    useEffect(() => {
        if (initialSelectedTask) {
            setSelectedTask(initialSelectedTask);
            setTabs(initialSelectedTask.tabs || []);
            setClaim(initialSelectedTask.assignie || false);
            if (initialSelectedTask.tabs?.length > 0) {
                setActiveTab(initialSelectedTask.tabs[0]);
            }
        }
    }, [initialSelectedTask]);


    const handleClaimToggle = () => {
        const newClaimStatus = !claim;
        setClaim(newClaimStatus);
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
        <Card className="vh-100 d-flex flex-column p-1 " style={{ maxHeight: '100vh', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', scrollbarColor: '#888 transparent' }}>
            <Row>
                <Col md={10} className="mb-2 mt-3 text-start">
                    <strong className="mx-4">{selectedTask.title}</strong>
                    <strong>{selectedTask.date}</strong>
                </Col>
                <Col md={2} className="mb-2 mt-2">
                    {!claim ? <>
                        <button className="btn btn-success" aria-label="Claim Task"  onClick={handleClaimToggle}>
                            Claim
                        </button>
                    </> : <>
                        <button className="btn btn-danger" aria-label="Unclaim Task"  onClick={handleClaimToggle}>
                            Unlaim
                        </button>
                    </>}
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
                            {activeTab === "Jira" && <>
                                {/* <h4>This is the Jira tab</h4> */}
                                <ProjectDetails selectedTask={selectedTask} />
                            </>}
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
