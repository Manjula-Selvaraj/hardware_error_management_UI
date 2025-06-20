import React, { use, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, Col, Row } from "react-bootstrap";
import "../styles.css";
import SampleData from "./SampleData.json";

import jsonData from "./jsonData.json";

const SRE_Details = ({
  selectedTask: initialSelectedTask,
  activeTab: selectedTab,
  formData,
  isClaimed,
  handleEnableSubmitButton,
}) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [data, setData] = useState(jsonData);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("Suggestions");
  const [checkboxStates, setCheckboxStates] = useState({});
  const [troubleshootText, setTroubleshootText] = useState("");
  const [isTroubleshootSuccessful, setIsTroubleshootSuccessful] =
    useState(false);
  const [incidentData, setIncidentData] = useState(
    initialSelectedTask?.variables?.find(
      (data) => data.name === "incidentData"
    ) || {}
  );
  const [bareData, setBareData] = useState(
    initialSelectedTask?.variables?.find(
      (data) => data.name === "bareMetalDetails"
    ) || {}
  );
  const [relatedJiraTickets, setRelatedJiraTickets] = useState(
    initialSelectedTask?.variables?.find(
      (data) => data.name === "relatedJiraTickets"
    ) || {}
  );

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

  useEffect(() => {
    if (incidentData) {
      setTroubleshootText(
        JSON.parse(incidentData?.previewValue)?.troubleshootInfo || ""
      );
      setIsTroubleshootSuccessful(
        JSON.parse(incidentData?.previewValue)?.successfulTroubleshoot || false
      );
      setCheckboxStates(JSON.parse(incidentData?.previewValue)?.playBook || {});
    }
  }, [incidentData]);

  const isFormSubmitted = !!formData;

  useEffect(() => {
    if (
      Object.keys(checkboxStates).length > 0 ||
      troubleshootText !== "" ||
      isTroubleshootSuccessful
    ) {
      handleEnableSubmitButton(
        checkboxStates,
        troubleshootText,
        isTroubleshootSuccessful
      );
    }
  }, [checkboxStates, troubleshootText, isTroubleshootSuccessful]);

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
      <Row className="d-flex align-items-stretch">
        <Col
          md={8.4}
          style={{ flex: "0 0 70%", maxWidth: "70%", paddingRight: "10px" }}
        >
          <Card
            className="mb-2 w-100 h-40 p-2 card-shadow border-0"
            style={{ height: "auto", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Error Description</div>
            <CardBody>
              <p>
                {
                  JSON.parse(incidentData?.previewValue)?.errorDetails
                    ?.description
                }
              </p>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-40 p-2 card-shadow border-0"
            style={{ height: "auto", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Investigation Details</div>
            <CardBody>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Key</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(bareData.value)?.keyValues?.map(
                      ({ key, value }, index) => (
                        <tr key={index}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Serial No.</th>
                      <th scope="col">Self</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(relatedJiraTickets?.previewValue)?.issues.map(
                      (issue, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <a
                              href={issue.self}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {issue.key}
                            </a>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div></div>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-20 p-2 card-shadow border-0"
            style={{ height: "auto", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Troubleshooting</div>
            <CardBody>
              <p>
                <div className="d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    style={{
                      accentColor: "rgb(133, 41, 205)",
                      marginRight: "8px",
                    }}
                    value={isTroubleshootSuccessful}
                    disabled={
                      !isClaimed ||
                      initialSelectedTask.taskDefinitionId ===
                        "Task_Orchestration_By_TAM"
                    }
                    onChange={(e) => {
                      setIsTroubleshootSuccessful(e.target.checked);
                    }}
                  />
                  <label className="mb-0">Troubleshoot successful?</label>
                </div>
                <textarea
                  className="form-control"
                  rows="4"
                  disabled={
                    !isClaimed ||
                    initialSelectedTask.taskDefinitionId ===
                      "Task_Orchestration_By_TAM"
                  }
                  placeholder="Enter investigation details here..."
                  defaultValue=""
                  style={{ resize: "none" }}
                  value={troubleshootText}
                  onChange={(e) => {
                    setTroubleshootText(e.target.value);
                  }}
                />
              </p>
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
              <div>
                {JSON.parse(incidentData?.previewValue)
                  ?.playBook.split(",")
                  .map((text, index) => (
                    <div
                      key={index}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "start",
                        borderBottom: "1px solid #ccc",
                        paddingBottom: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${index}`}
                        style={{
                          accentColor: "rgb(133, 41, 205)",
                          marginRight: "8px",
                          marginTop: "5px",
                          cursor: "pointer",
                        }}
                        disabled={
                          !isClaimed ||
                          initialSelectedTask.taskDefinitionId ===
                            "Task_Orchestration_By_TAM"
                        }
                        onChange={(e) => {
                          const checkboxData = document.querySelectorAll(
                            'input[type="checkbox"]:not([value])'
                          );
                          const checkboxStates = Array.from(checkboxData)
                            .map((checkbox) => {
                              const label =
                                checkbox.nextElementSibling.textContent.trim();
                              return `${label}:${checkbox.checked}`;
                            })
                            .join(",");
                          setCheckboxStates(checkboxStates);
                        }}
                        checked={
                          !isClaimed ||
                          initialSelectedTask.taskDefinitionId ===
                            "Task_Orchestration_By_TAM"
                            ? text.includes(":") &&
                              text.split(":")[1] === "true"
                            : null
                        }
                      />
                      <label
                        htmlFor={`checkbox-${index}`}
                        style={{ cursor: "pointer", margin: 0 }}
                      >
                        {text.includes(":") ? text.split(":")[0] : text}
                      </label>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SRE_Details;
