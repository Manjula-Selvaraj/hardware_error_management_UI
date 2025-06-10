import React, { useEffect, useState } from "react";
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
  CardHeader,
  Col,
  Dropdown,
  Row,
} from "react-bootstrap";
import "../styles.css";
import { Breadcrumb } from "react-bootstrap";
import "./JIraBoard.css";

import jsonData from "./jsonData.json";

const JiraBoard = ({ selectedTask: initialSelectedTask, onCommentsUpdate }) => {
  const [selectedProject, setSelectedProject] = useState({});
  const [data, setData] = useState(jsonData);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("Comments");

  const tabs = ["All", "Comments"];

  useEffect(() => {
    try {
      if (!Array.isArray(data)) throw new Error("Data is not an array");

      const matchedProject = data.find(
        (item) => item?.id === initialSelectedTask?.id
      );
      if (!matchedProject) {
        console.warn("No matching project found for selected task.");
        setSelectedProject({});
        setComments([]);
        return;
      }

      setSelectedProject(matchedProject);
      const commentList = matchedProject?.fields?.comment?.comments;
      setComments(Array.isArray(commentList) ? commentList : []);
    } catch (error) {
      console.error("Error processing jsonData:", error);
      setSelectedProject({});
      setComments([]);
    }
  }, [initialSelectedTask, data]);

  const extractDescriptionText = (desc) => {
    if (!Array.isArray(desc?.content)) return "No description available";

    try {
      return (
        desc.content
          .map((block) => {
            if (!Array.isArray(block?.content)) return "";
            return block.content.map((inner) => inner?.text || "").join(" ");
          })
          .join("\n")
          .trim() || "No description available"
      );
    } catch (err) {
      console.error("Failed to parse description:", err);
      return "No description available";
    }
  };

  const updateData = (newComments) => {
    const updatedData = data.map((item) => {
      if (item.id === initialSelectedTask?.id) {
        return {
          ...item,
          fields: {
            ...item.fields,
            comment: {
              ...(item.fields?.comment || {}),
              comments: newComments,
            },
          },
        };
      }
      return item;
    });

    setData(updatedData);
    setSelectedProject((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        comment: {
          ...(prev.fields?.comment || {}),
          comments: newComments,
        },
      },
    }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSaveComment = (comment) => {
    const newComments = [comment, ...comments];
    setComments(newComments);
    setComment("");
    updateData(newComments);

    // Notify parent
    if (onCommentsUpdate) {
      onCommentsUpdate(newComments);
    }
  };

  return (
    <Row>
      <Col md={8} className="text-start">
        {/* Breadcrumbs */}
        <div>
          <div class="breadcrumbs">
            <p>item1</p>
            <p>item2</p>
            <p>item1</p>
            <p>item2</p>
          </div>
        </div>
        <div class="content">
          <h2>Welcome to My Page</h2>
          <div class="extra">
                <div class="extra_item">to do v</div>
                <div class="add_item"><span>+</span> add</div>
            </div>
          <div class="dsc">
            <h3>description</h3>
            <textarea placeholder="Add a description"></textarea>
            <div class="buttonset">
              <button class="btn-primary">Save</button>
              <button>cancel</button>
            </div>
          </div>
          <div class="confluence">
            <div class="c_top">
              <h3>
                Confluence content <span class="info">i</span>
              </h3>
              <button class="dots">...</button>
            </div>
            <div class="template">
              <span class="t_name">📘 product requirement</span>
              <button class="t_btn">try template</button>
            </div>
          </div>
          <div class="activity">
                <h3>activity</h3>
                <div class="a_top">
                    <div class="activity_set">
                        <div class="activity_item">All</div>
                        <div class="activity_item active">comments</div>
                        <div class="activity_item">history</div>
                        <div class="activity_item">work log</div>
                    </div>
                    <button>⬇️</button>
                </div>
                <div class="add_comment">
                    <img src="https://placehold.co/20" class="profile_pic" />
                    <div class="comment_box">
                        <textarea placeholder="Add a comment..."></textarea>
                        <p><strong>Pro tip:</strong> press <span class="key">M</span> to comment</p>
                    </div>

                </div>
                <div class="comment_list">
                    <div class="comment_item">
                        <img src="https://placehold.co/30" class="profile_pic" />
                        <div class="comment_content">
                            <h4 class="commentor">Victor deb</h4>
                            <p class="date">May 5, 2025 at 1:15 PM</p>
                            <p class="comment_text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                                voluptatum.</p>
                            <div class="comment_actions">
                                <button class="action_item">↪</button>
                                <button class="action_item">👍</button>
                                <button class="action_item">🙂</button>
                                <button class="action_item">📝</button>
                                <button class="more">...</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mx-1 mt-1 d-none">
          <Breadcrumb>
            <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
            {selectedProject?.fields?.project?.name && (
              <Breadcrumb.Item active>
                {selectedProject.fields.project.name}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>

        {/* Left Side */}
        <h3>
          <strong className="mx-4">
            {selectedProject?.fields?.project?.name}
          </strong>
        </h3>
        <div className="mx-4 d-none">
          <h5>
            <label>Description</label>
          </h5>
          <p>{extractDescriptionText(selectedProject?.fields?.description)}</p>
        </div>

        {/* <hr /> */}

        {/* Tab Section */}
        <Card className="mb-4 d-none">
          <CardBody>
            {/* Tab Navigation */}
            <div className="d-flex mb-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-2 border-0 bg-transparent ${
                    activeTab === tab
                      ? "border-primary border-bottom-2 text-primary"
                      : "text-muted"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    borderBottom:
                      activeTab === tab ? "2px solid #0d6efd" : "none",
                    outline: "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Comments Tab Content */}
            {activeTab === "Comments" && (
              <div>
                <textarea
                  className="form-control mb-3"
                  rows={3}
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={handleCommentChange}
                />

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button
                    className="btn btn-outline-danger btn-sm border-none"
                    aria-label="clear comment"
                    onClick={() => setComment("")}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm border-none"
                    aria-label="Save comment"
                    onClick={(e) => handleSaveComment(comment)}
                  >
                    Save
                  </button>
                </div>

                {/* Comments List */}
                <div className="mt-3">
                  {comments.map((comment, index) => (
                    <div key={index} className="card mb-2 position-relative">
                      <div className="card-body">
                        <p>{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== "Comments" && (
              <div className="text-muted py-3">
                {activeTab} content would appear here
              </div>
            )}
          </CardBody>
        </Card>
      </Col>

      {/* Vertical Line */}
      <Col md={1} className="d-flex align-items-right d-none">
        <div style={{ borderLeft: "1px solid #ccc", height: "99vh" }}></div>
      </Col>

      {/* Right Side */}
      <Col md={3} className="mb-2 mt-2">
        <select
          id="statusSelect"
          className="form-select mb-3"
          aria-label="Select status"
          value={
            selectedProject?.fields?.statusCategory?.name?.toLowerCase() ||
            "todo"
          }
          style={{ width: "120px" }}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="complete">Complete</option>
        </select>

        <Card style={{ border: "1px solid #ccc", borderRadius: "1px" }}>
          <Card.Header className="text-start">
            <strong>Details</strong>
          </Card.Header>
          <CardBody className="text-start">
            <p>
              <strong>Assignee:</strong>{" "}
              {selectedProject?.fields?.assignee || "None"}
            </p>
            <p>
              <strong>Labels:</strong>{" "}
              {selectedProject?.fields?.labels?.join(", ") || "None"}
            </p>
            <p>
              <strong>Parent:</strong>{" "}
              {selectedProject?.fields?.issuetype?.name || "None"}
            </p>
            <p>
              <strong>Team:</strong> {selectedProject?.fields?.team || "None"}
            </p>
            <p>
              <strong>Story point estimate:</strong>{" "}
              {selectedProject?.fields?.aggregatetimeestimate || "None"}
            </p>
            <p>
              <strong>Sprint:</strong>{" "}
              {selectedProject?.fields?.sprint || "None"}
            </p>
            <p>
              <strong>Reporter:</strong>{" "}
              {selectedProject?.fields?.reporter?.displayName || "None"}
            </p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default JiraBoard;
