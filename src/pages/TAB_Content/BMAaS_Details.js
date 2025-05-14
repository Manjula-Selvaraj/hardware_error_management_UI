import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody, Col, Row, Breadcrumb } from 'react-bootstrap';
import '../styles.css';

import jsonData from '../jsonData.json';

const BMAas_Details = ({ selectedTask: initialSelectedTask }) => {
    const [selectedProject, setSelectedProject] = useState({});
    const [data, setData] = useState(jsonData);
    const [suggestion, setsuggestion] = useState('');
    const [Suggestions, setSuggestions] = useState([]);
    const [activeTab, setActiveTab] = useState('Suggestions');

    const tabs = ['All', 'Suggestions'];

    useEffect(() => {
        const matchedProject = data.find(item => item.id === initialSelectedTask?.id) || {};
        setSelectedProject(matchedProject);
        setSuggestions(matchedProject?.fields?.suggestion?.Suggestions || []);
    }, [initialSelectedTask, data]);

    const extractDescriptionText = (desc) => {
        if (!desc?.content) return "No description available";
        return desc.content
            .map(block => block.content?.map(inner => inner.text).join(" "))
            .join("\n");
    };

    const updateData = (newSuggestions) => {
        const updatedData = data.map(item => {
            if (item.id === initialSelectedTask?.id) {
                return {
                    ...item,
                    fields: {
                        ...item.fields,
                        suggestion: {
                            ...(item.fields?.suggestion || {}),
                            Suggestions: newSuggestions
                        }
                    }
                };
            }
            return item;
        });

        setData(updatedData);
        setSelectedProject(prev => ({
            ...prev,
            fields: {
                ...prev.fields,
                suggestion: {
                    ...(prev.fields?.suggestion || {}),
                    Suggestions: newSuggestions
                }
            }
        }));

        localStorage.setItem('projectData', JSON.stringify(updatedData));
    };

    const handlesuggestionChange = (e) => {
        setsuggestion(e.target.value);
    };

    const handleSavesuggestion = (suggestion) => {
        const newSuggestions = [...Suggestions, suggestion];
        setSuggestions(newSuggestions);
        setsuggestion('');
        updateData(newSuggestions);
    };

    const handleDeletesuggestion = (index) => {
        const newSuggestions = Suggestions.filter((_, i) => i !== index);
        setSuggestions(newSuggestions);
        updateData(newSuggestions);
    };

    return (
        <Row className="d-flex align-items-stretch">
            {/* Left Side */}
            <Col md={6} className="d-flex mb-2 text-start">
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
            <Col md={6} className="d-flex mb-2">
                <Card className="mb-2 w-100">
                    <CardBody className="d-flex flex-column">
                        <div className="d-flex border-bottom mb-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`px-3 py-2 border-0 bg-transparent ${activeTab === tab ? 'border-primary border-bottom-2 text-primary' : 'text-muted'}`}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        borderBottom: activeTab === tab ? '2px solid #0d6efd' : 'none',
                                        outline: 'none'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        {activeTab === 'Suggestions' && (
                            <div>
                                <textarea
                                    className="form-control mb-3"
                                    rows={3}
                                    placeholder="Add a suggestion..."
                                    value={suggestion}
                                    onChange={handlesuggestionChange}
                                />

                                <div className="d-flex flex-wrap gap-2 mb-3">
                                    <button
                                        className="btn btn-outline-danger btn-sm border-none"
                                        onClick={() => setsuggestion("")}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-outline-success btn-sm border-none"
                                        onClick={() => handleSavesuggestion(suggestion)}
                                    >
                                        Save
                                    </button>
                                </div>

                                <div className="mt-3">
                                    {Suggestions.map((suggestion, index) => (
                                        <div key={index} className="card mb-2 position-relative">
                                            <div className="card-body">
                                                <p>{suggestion}</p>
                                                <FaTrashAlt
                                                    onClick={() => handleDeletesuggestion(index)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '16px',
                                                        color: 'red',
                                                        position: 'absolute',
                                                        bottom: '10px',
                                                        right: '10px'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab !== 'Suggestions' && (
                            <div className="text-muted py-3">
                                {activeTab} content would appear here
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default BMAas_Details;
