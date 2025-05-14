import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import '../styles.css';
import SampleData from './SampleData.json';

import jsonData from '../jsonData.json';

const BMAaS_Details = ({ selectedTask: initialSelectedTask, activeTab: selectedTab, formData}) => {
    const [selectedProject, setSelectedProject] = useState({});
    const [data, setData] = useState(jsonData);
    const [suggestion, setsuggestion] = useState('');
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
     {isFormSubmitted && formData.id === initialSelectedTask.id && (
        <Col md={6} className="d-flex mb-2 text-start">
          <Card className="mb-2 w-100">
            <CardBody className="d-flex flex-column">
             

              <div>
                <div>
                  <p><strong>Comments:</strong> <hr></hr>{formData.comments}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      )}

      <Col md={(isFormSubmitted && formData.id === initialSelectedTask.id) ? 6 : 12} className="d-flex mb-2">
        <Card className="mb-2 w-100">
          <CardHeader className="boldtext">Suggestions</CardHeader>
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

export default BMAaS_Details;
