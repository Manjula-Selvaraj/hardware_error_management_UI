import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, CardHeader, Col, Dropdown, Row } from 'react-bootstrap';
import './styles.css';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const TaskDetails = (props) => {

    const [selectedTask, setSelectedTask] = useState(props.selectedTask);
    const [tabs,setTabs] = useState([props.selectedTask.tabs]);
    //const tabs = ['Grafana', 'Pager', 'SRE', 'TAM', 'BMAaS', 'DC', 'Jira'];

    useEffect(() => {
        setSelectedTask(props.selectedTask);
       setTabs(props.selectedTask.tabs);
        console.log(props,props.setSelectedTask, selectedTask.tabs)
    }, [props,selectedTask]);

    const [activeTab, setactiveTab] = React.useState('Grafana');

   

    const handleChange = (event, newactiveTab) => {
        setactiveTab(newactiveTab);
    };

    return (
        <Card className="vh-100 d-flex flex-column p-1 ">
            <Row>
                <Col md={10} className='mb-2 mt-3 text-start'>
                    <strong className='mx-4'>{selectedTask.title}</strong>
                    <strong>{selectedTask.date}</strong>
                </Col>
                <Col md={2} className='mb-2 mt-2'>
                    {!selectedTask.assignie ? <>
                        <button className="btn btn-success" aria-label="Claim Task">
                            Claim
                        </button>
                    </> : <>
                        <button className="btn btn-danger" aria-label="Unclaim Task">
                            Unlaim
                        </button>
                    </>}
                </Col>

            </Row>
            <Row className="vh-50 d-flex flex-column p-3">
                <Card className="vh-50 d-flex flex-column p-1">
                    <ToggleButtonGroup
                        color="primary"
                        value={activeTab}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                    >
                        {tabs.map((tab) => (
                            <ToggleButton key={tab} value={tab} className='boldtext tabs-container' >
                                {tab}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    <div className='text-start margin'>

                        {activeTab === "Grafana" ? <>
                            <h4> This is  Grafara tab </h4>
                        </> : null
                        }

                        {activeTab === "Pager" ? <>
                            <h4> This is  Pager tab </h4>
                        </> : null
                        }

                        {activeTab === "SRE" ? <>
                            <h4> This is  SRE tab </h4>
                        </> : null
                        }

                        {activeTab === "TAM" ? <>
                            <h4> This is  TAM tab </h4>
                        </> : null
                        }

                        {activeTab === "BMAaS" ? <>
                            <h4> This is  BMAAS tab </h4>
                        </> : null
                        }

                        {activeTab === "DC" ? <>
                            <h4> This is  DC tab </h4>
                        </> : null
                        }

                        {activeTab === "Jira" ? <>
                            <h4> This is  Jira tab </h4>
                        </> : null
                        }
                    </div>
                </Card>
            </Row>
            <Row className="vh-50 d-flex flex-column p-3">
                <Card className="vh-50 d-flex flex-column p-0">
                <CardHeader style={{color: "black", fontSize: "20px"}}><strong>User Form</strong></CardHeader>
                <CardBody></CardBody>
                </Card>
            </Row>
        </Card>
    );
};

export default TaskDetails;
