import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, Col, Row, Breadcrumb, CardHeader } from 'react-bootstrap';
import '../styles.css';

import data from './jsonData.json';
import SampleData from './SampleData.json';

const DC_Details = ({ selectedTask: initialSelectedTask, activeTab: selectedTab }) => {
    const [selectedProject, setSelectedProject] = useState({});
    const [suggestions, setSuggestions] = useState([]);




    useEffect(() => {

        const matchedProject = data.find(item => item.id === initialSelectedTask?.id) || {};
        setSelectedProject(matchedProject);


        console.log("seleceted TAb from props", selectedTab);
        const filteredData = SampleData.find((item) => item.fields.task.name === selectedTab)?.fields.suggestion.Suggestions || [];
        setSuggestions(filteredData);

        console.log("filtered Data....", filteredData);

    }, [initialSelectedTask, data, SampleData,selectedTab]);


    const extractDescriptionText = (desc) => {
        if (!desc?.content) return "No description available";
        return desc.content
            .map(block => block.content?.map(inner => inner.text).join(" "))
            .join("\n");
    };



    return (
        <Row className="d-flex align-items-stretch">
            {/* Left Side */}
            <Col md={7} className="d-flex mb-2 text-start">
                <Card className="mb-2 w-100" >
                    <CardBody className="d-flex flex-column">
                        <div className="mx-1">
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
                                {selectedProject?.fields?.project?.name && (
                                    <Breadcrumb.Item active>{selectedProject.fields.project.name}</Breadcrumb.Item>
                                )}
                            </Breadcrumb>
                        </div>

                        <h3><strong className="mx-4">{selectedProject?.fields?.project?.name}</strong></h3>
                        <div className="mx-4">
                            <h5><label>Description</label></h5>
                            <p>{extractDescriptionText(selectedProject?.fields?.description)}</p>
                        </div>
                        <hr />
                    </CardBody>
                </Card>
            </Col>

            {/* Right Side */}
            <Col md={5} className="d-flex mb-2">
                <Card className="mb-2 w-100">
                    <CardHeader className='boldtext'>Suggestions</CardHeader>
                    <CardBody className="d-flex flex-column">
                        {suggestions.length === 0 ? (
                            <p className="text-muted">No suggestions available.</p>
                        ) : (
                            suggestions.map((suggestion, index) => (
                                <div key={index} className="card mb-2">
                                    <div className="card-body">
                                        <h6 className="card-title mb-1">{suggestion.title}</h6>
                                        <p className="card-text mb-1">{suggestion.description}</p>
                                        <small className="text-muted">
                                            Status: {suggestion.status} | Date: {suggestion.createdAt}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardBody>

                </Card>
            </Col>
        </Row>
    );
};

export default DC_Details;
