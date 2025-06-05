import React, { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrashAlt,
  FaUserCircle,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Col, Row, Breadcrumb } from "react-bootstrap";
import "../styles.css";
import SampleData from "./SampleData.json";

import jsonData from "./jsonData.json";
import { CardHeader } from "@mui/material";

const SRE_Details = ({
  selectedTask: initialSelectedTask,
  activeTab: selectedTab,
  formData,
}) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [data, setData] = useState(jsonData);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("Suggestions");

  const tabs = ["All", "Suggestions"];

  useEffect(() => {
    const matchedProject =
      data.find((item) => item.id === initialSelectedTask?.id) || {};
    setSelectedProject(matchedProject);

    const filteredData =
      SampleData.find((item) => item.fields.task === selectedTab)?.fields
        .suggestion.Suggestions || [];
    setSuggestions(filteredData);
  }, [initialSelectedTask, selectedTab]);

  const isFormSubmitted = !!formData;

  return (
    <>
      {/* change it to d-fllex to show */}
      <Row className="d-none align-items-stretch">
        {isFormSubmitted && formData.id === initialSelectedTask.id && (
          <Col md={6} className="d-flex mb-2 text-start">
            <Card className="mb-2 w-100">
              <CardBody className="d-flex flex-column">
                <div>
                  <div>
                    <p>
                      <strong>Comments:</strong> <hr></hr>
                      {formData.comments}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        )}

        <Col
          md={
            isFormSubmitted && formData.id === initialSelectedTask.id ? 6 : 12
          }
          className="d-flex mb-2"
        >
          <Card className="mb-2 w-100">
            <CardBody>
              <strong>Suggestions:</strong>{" "}
            </CardBody>

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
                        Status: {suggestion.status} | Date:{" "}
                        {suggestion.createdAt}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row
        style={{ height: "70vh", overflowY: "auto" }}
        className="d-flex align-items-stretch"
      >
        <Col
          md={8.4}
          style={{ flex: "0 0 70%", maxWidth: "70%", paddingRight: "10px" }}
        >
          <Card
            className="mb-2 w-100 h-40 p-2 card-shadow border-0"
            style={{ height: "39%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Error Description</div>
            <CardBody>
              {/* Add your content for the 70% section here */}
              <p>More details about Error Description</p>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-40 p-2 card-shadow border-0"
            style={{ height: "38%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Investigation Details</div>
            <CardBody>
              {/* Add your content for the 70% section here */}
              <p>More details about Investigation Details</p>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-20 p-2 card-shadow border-0"
            style={{ height: "20%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Troubleshooting</div>
            <CardBody>
              {/* Add your content for the 70% section here */}
              <p>More details about Troubleshooting</p>
            </CardBody>
          </Card>
        </Col>
        <Col
          md={3.6}
          style={{ flex: "0 0 30%", maxWidth: "30%", paddingLeft: "0px" }}
        >
          <Card
            className="mb-2 w-100 h-100 p-2 card-shadow border-0"
            style={{ borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Play Book</div>
            <CardBody>
              {/* Add your content for the 30% section here */}
              <p>More details about Play Book</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SRE_Details;
