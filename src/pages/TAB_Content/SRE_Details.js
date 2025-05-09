import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, Col, Row, Breadcrumb } from 'react-bootstrap';
import '../styles.css';
import SampleData from './SampleData.json';

import jsonData from './jsonData.json';
import { CardHeader } from '@mui/material';

const SRE_Details = ({selectedTask: initialSelectedTask, activeTab: selectedTab,formData }) => {
    const [selectedProject, setSelectedProject] = useState({});
    const [data, setData] = useState(jsonData);
    const [suggestions, setSuggestions] = useState([]);
    const [activeTab, setActiveTab] = useState('Suggestions');

    const tabs = ['All', 'Suggestions'];

    useEffect(() => {
        const matchedProject = data.find(item => item.id === initialSelectedTask?.id) || {};
        setSelectedProject(matchedProject);
      
        const filteredData = SampleData.find(item => item.fields.task === selectedTab)?.fields.suggestion.Suggestions || [];
        setSuggestions(filteredData);
      }, [initialSelectedTask, selectedTab]);
      

   
    const isFormSubmitted = !!formData;
   

    return (
        <Row className="d-flex align-items-stretch">
        {isFormSubmitted && (
          <Col md={6} className="d-flex mb-2 text-start">
            <Card className="mb-2 w-100">
              <CardBody className="d-flex flex-column">
                <div className="mx-1">
                  <Breadcrumb>
                    <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
                    {selectedProject?.fields?.project?.name && (
                      <Breadcrumb.Item active>{selectedProject.fields.project.name}</Breadcrumb.Item>
                    )}
                  </Breadcrumb>
                </div>
  
                <div>
                  <h4>DC Details for Task: {initialSelectedTask?.title}</h4>
                  <div>
                    <h5>Form Data Submitted:</h5>
                    <p><strong>Comments:</strong> <hr></hr>{formData.comments}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        )}
  
        <Col md={isFormSubmitted ? 6 : 12} className="d-flex mb-2">
          <Card className="mb-2 w-100">
            <CardHeader className="boldtext"> Suggestions</CardHeader> 
            <CardHeader className="boldtext"> Suggestions</CardHeader>
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

export default SRE_Details;
