import React, { useEffect, useState, useContext } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrashAlt,
  FaUserCircle,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Card,
  CardBody,
  Col,
  Row,
  Breadcrumb,
  CardHeader,
} from "react-bootstrap";
import "../styles.css";
import SampleData from "./SampleData.json";
import { AuthContext } from "../../AuthProvider";

import jsonData from "./jsonData.json";

const TAM_Details = ({
  selectedTask: initialSelectedTask,
  activeTab: selectedTab,
  formData,
  handleTamPayload,
}) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [data, setData] = useState(jsonData);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("Suggestions");

  const [isRepairable, setIsRepairable] = useState(false);
  const [baremetalId, setBaremetalId] = useState("");
  const [remarks, setRemarks] = useState("");

  const tabs = ["All", "Suggestions"];

  const { keycloak } = useContext(AuthContext);

  useEffect(() => {
    const matchedProject =
      data.find((item) => item.id === initialSelectedTask?.id) || {};
    setSelectedProject(matchedProject);
    const filteredData =
      SampleData.find((item) => item.fields.task === selectedTab)?.fields
        .suggestion.Suggestions || [];
    setSuggestions(filteredData);
  }, [initialSelectedTask, selectedTab]);

  useEffect(() => {
    if (isRepairable && baremetalId && remarks) {
      const tamPayload = {
        tamTeamData: {
          repairable: isRepairable,
          newBareMetalId: baremetalId,
          remarks: remarks,
        },
        userInfoTam: {
          username: keycloak?.tokenParsed?.preferred_username || "defaultUser",
          email: keycloak?.tokenParsed?.email || "defaultEmail",
        },
      };
      handleTamPayload(tamPayload);
    }
  }, [isRepairable, baremetalId, remarks]);

  const isFormSubmitted = !!formData;

  const handleSubmit = () => {
    const payload = {
      tamTeamData: {
        repairable: isRepairable,
        newBareMetalId: baremetalId,
        remarks: remarks,
      },
      userInfoTam: {
        username: keycloak?.tokenParsed?.preferred_username || "defaultUser",
        email: keycloak?.tokenParsed?.email || "defaultEmail",
      },
    };
    console.log("Form submitted with data:", payload);
  };

  return (
    <Row className="d-flex align-items-stretch">
      {isFormSubmitted && formData.id === initialSelectedTask.id && (
        <Col md={6} className="d-flex mb-2">
          <Card className="mb-2 w-100">
            <CardBody className="d-flex flex-column">
              <div>
                <div>
                  <p>
                    <strong>Comments:</strong>
                    <br />
                    {formData.comments}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      )}

      <Col
        md={isFormSubmitted && formData.id === initialSelectedTask.id ? 6 : 12}
        className="d-flex mb-2"
      >
        <Card className="mb-2 w-100 h-100 p-2 card-shadow border-0">
          <div className="p-3">
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="repairable"
                  checked={isRepairable}
                  onChange={(e) => setIsRepairable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="repairable">
                  Repairable
                </label>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="baremetalId" className="form-label">
                New Baremetal ID
              </label>
              <input
                type="text"
                value={baremetalId}
                className="form-control"
                id="baremetalId"
                onChange={(e) => setBaremetalId(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="remarks" className="form-label">
                Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="form-control"
                id="remarks"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: "#8529cd",
                color: "white",
                borderRadius: "6px",
                fontSize: "16px",
                borderColor: "#8529cd",
                display: "none",
              }}
              disabled={!isRepairable || !baremetalId || !remarks}
              onClick={() => handleSubmit()}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
          {/* <CardHeader className="boldtext">Suggestions</CardHeader>
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
            </CardBody> */}
        </Card>
      </Col>
    </Row>
  );
};

export default TAM_Details;
