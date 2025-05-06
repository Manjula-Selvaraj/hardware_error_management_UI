import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import jsonData from './jsonData.json';
import ProjectDetails from './ProjectDetails';

const JiraBoard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProjectListOpen, setIsProjectListOpen] = useState(true);
  const [projects, setProjects] = useState(jsonData);

  const projectsPerPage = 6;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const currentProjects = projects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);
  const iconColor = isHovered ? "rgb(250, 252, 254)" : "rgb(68, 84, 111)";

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedProject(null);
    }
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />

      <div className="d-flex" style={{ maxHeight: "100vh", backgroundColor: 'transparent' }}>
        {/* Sidebar */}
        <div className={`bg-light border-end sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <div
            onClick={() => setIsCollapsed(!isCollapsed)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`hover-button ${isHovered ? 'hovered' : ''}`}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <FaChevronRight color={iconColor} /> : <FaChevronLeft color={iconColor} />}
          </div>

          {/* Projects Header Toggle */}
          {!isCollapsed && (
            <div
              onClick={() => setIsProjectListOpen(!isProjectListOpen)}
              className="d-flex justify-content-between align-items-center p-2 border-bottom"
              style={{ cursor: 'pointer' }}
            >
              <label className="mb-0"><strong>Projects</strong></label>
              <span style={{ marginLeft: '10rem' }}>
                {isProjectListOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </div>
          )}

          {/* Project List */}
          {!isCollapsed && isProjectListOpen && (
            <div className="p-3" style={{ maxHeight: '100vh' }}>
              {currentProjects.length > 0 ? (
                currentProjects.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 mb-2 border rounded"
                    style={{
                      backgroundColor: selectedProject?.id === item.id ? "#99def3" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedProject(item)}
                  >
                    <div className="text-start">
                      <strong>{item.fields.project.name}</strong>
                      <span className="ms-2 text-muted">&gt;</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects available</p>
              )}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-grow-1 p-2">
          {selectedProject ? (
            <ProjectDetails selectedProject={selectedProject} />
          ) : (
            <p className="text-center mt-4">Select a project to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JiraBoard;
