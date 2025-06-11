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
            style={{ height: "37%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Error Description</div>
            <CardBody>
              <p>
                Application failed to connect to the database due to a timeout.
                Suspected root cause is an unstable network connection between
                the app server and the database cluster. Impacted users are
                unable to retrieve or submit data. Issue started at
                approximately 10:12 AM IST and is intermittent.
              </p>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-40 p-2 card-shadow border-0"
            style={{ height: "36%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Investigation Details</div>
            <CardBody>
              <p>
                Initial investigation by the SRE team indicates intermittent
                packet loss between the application server and the database
                host. Network traces show latency spikes around the time of
                failure. No recent deployment or configuration changes noted.
                Awaiting confirmation from the network team for further
                analysis.
              </p>
            </CardBody>
          </Card>
          <Card
            className="mb-2 w-100 h-20 p-2 card-shadow border-0"
            style={{ height: "24%", borderRadius: "0px" }}
          >
            <div style={{ fontWeight: "bold" }}>Troubleshooting</div>
            <CardBody>
              <p>
                Restarted the affected application pods and flushed DNS cache.
                Temporarily rerouted traffic to a healthy database replica.
                Monitored logs and metrics using Prometheus and Grafana for
                anomalies. Engaged network team to run deeper diagnostics on the
                connectivity layer.
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
              {/* <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginTop: "5px" }}>
                  Verify the alert source and confirm the error is reproducible.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Check application logs for exceptions or timeouts related to
                  the database.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Validate connectivity from the application server to the
                  database (ping/telnet).
                </li>
                <li style={{ marginTop: "5px" }}>
                  Review metrics (CPU, memory, latency) on both app and DB nodes
                  via monitoring tools.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Inspect recent deployment or infrastructure changes in the
                  last 24 hours.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Restart impacted services or pods to see if the issue is
                  transient.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Engage the network team to trace any packet loss or latency
                  issues.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Failover to a replica database instance if supported and
                  necessary.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Communicate interim status and workarounds to stakeholders and
                  support teams.
                </li>
                <li style={{ marginTop: "5px" }}>
                  Document the root cause, resolution steps, and preventive
                  actions in the incident tracker.
                </li>
              </ul> */}
              <div >
  {[
    "Verify the alert source and confirm the error is reproducible.",
    "Check application logs for exceptions or timeouts related to the database.",
    "Validate connectivity from the application server to the database (ping/telnet).",
    "Review metrics (CPU, memory, latency) on both app and DB nodes via monitoring tools.",
    "Inspect recent deployment or infrastructure changes in the last 24 hours.",
    "Restart impacted services or pods to see if the issue is transient.",
    "Engage the network team to trace any packet loss or latency issues.",
    "Failover to a replica database instance if supported and necessary.",
    "Communicate interim status and workarounds to stakeholders and support teams.",
    "Document the root cause, resolution steps, and preventive actions in the incident tracker."
  ].map((text, index) => (
    <div key={index} style={{ marginTop: "10px", display: "flex", alignItems: "start" }}>
      <input
        type="checkbox"
        id={`checkbox-${index}`}
        style={{
          accentColor: "rgb(133, 41, 205)",
          marginRight: "8px",
          marginTop: "5px",
          cursor: "pointer"
        }}
      />
      <label
        htmlFor={`checkbox-${index}`}
        style={{ cursor: "pointer", margin: 0 }}
      >
        {text}
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
