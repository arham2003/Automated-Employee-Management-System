import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Button, Modal } from "react-bootstrap";
import ProjectForm from "./ProjectUpdateForm"; // Import the ProjectForm component
import axios from "axios"; // Axios for making API calls
import ProjectPhase from "./ProjectPhase"; // Import the ProjectPhase component

function ProjectDetail() {
  const { id } = useParams(); // Get the project ID from URL params
  const [project, setProject] = useState(null); // Project details state
  const [projectParts, setProjectParts] = useState([]); // Project parts state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showProjectModal, setShowProjectModal] = useState(false); // Modal for editing project details
  const [partsError, setPartsError] = useState(null); // Error for project parts

  // Fetch project details and parts from the backend
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/projects/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project data");
        }
        const projectData = await response.json();
        if (projectData.Status && projectData.Project) {
          setProject(projectData.Project); // Store project data
        } else {
          setError("Project not found.");
        }

        // Fetch project parts after loading the project details
        try {
          const partsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_parts/${id}`);
          if (!partsResponse.ok) {
            throw new Error("Failed to fetch project parts");
          }
          const partsData = await partsResponse.json();
          setProjectParts(partsData); // Store the actual project parts data
        } catch (partsErr) {
          setPartsError("Project Phases Not Decided Yet."); // Handle failure in fetching project parts
          setProjectParts([]); // Optional: Empty array when the parts fetch fails
        }
      } catch (err) {
        setError("Error fetching project data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // Handle project details form visibility
  const toggleProjectForm = () => setShowProjectModal(true); // Show the project details modal
  const handleCloseProjectModal = () => setShowProjectModal(false); // Hide the project details modal

  // Update the project in the parent component after successful update
  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject); // Update the project with the new details
    setShowProjectModal(false); // Close the modal
  };

  // Update project part (edit part functionality)
  const handleUpdatePhase = (updatedPhase) => {
    // Here, you can update the specific project phase (or part) logic
    setProjectParts(prevParts => 
      prevParts.map(part => 
        part.part_id === updatedPhase.part_id ? updatedPhase : part
      )
    );
  };

  // Handle deletion of a project part
  const handleDelete = async (partId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/project_parts/${partId}`);
      if (response.status === 200) {
        // Update the state to remove the deleted part
        setProjectParts(projectParts.filter((part) => part.part_id !== partId));
        alert("Project part deleted successfully");
      } else {
        alert("Failed to delete project part");
      }
    } catch (error) {
      console.error("Error deleting project part", error);
      alert("Error deleting project part");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Function to format the date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
  };

  return (
    <div className="project-detail-container" style={{ padding: "20px", textAlign: "center" }}>
      {project ? (
        <div className="project-details">
          <Button variant="primary" onClick={toggleProjectForm} style={{ marginBottom: "20px" }}>
            Edit Project Details
          </Button>

          {/* Modal for Editing Project Details */}
          <Modal show={showProjectModal} onHide={handleCloseProjectModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Pass the current project data to the form and format the dates */}
              <ProjectForm 
                project={{
                  ...project,
                  startDate: formatDateForInput(project.startDate),
                  expectedDate: formatDateForInput(project.expectedDate),
                }} 
                onUpdate={handleProjectUpdate}  // Pass the callback to update the project
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseProjectModal}>Close</Button>
              <Button variant="primary" onClick={handleCloseProjectModal}>Save Changes</Button>
            </Modal.Footer>
          </Modal>

          <h3>{project.projectName}</h3>
          <Table striped bordered hover style={{ marginBottom: "40px" }}>
            <tbody>
              <tr><td><strong>Customer:</strong></td><td>{project.customerName}</td></tr>
              <tr><td><strong>Start Date:</strong></td><td>{formatDateForInput(project.startDate)}</td></tr>
              <tr><td><strong>End Date:</strong></td><td>{formatDateForInput(project.expectedDate)}</td></tr>
              <tr><td><strong>Budget:</strong></td><td>${project.budget.toLocaleString()}</td></tr>
              <tr><td><strong>Status:</strong></td><td>{project.status}</td></tr>
            </tbody>
          </Table>

          {/* Project Phase Table */}
          <div>
            {partsError ? (
              <p>{partsError}</p> // Show error message if API for project parts fails
            ) : (
              <ProjectPhase 
                projectParts={projectParts} 
                handleDelete={handleDelete} // Pass handleDelete to ProjectPhase
                onUpdatePhase={handleUpdatePhase} // Pass handleUpdatePhase to ProjectPhase
              /> // Show the project parts if data is available
            )}
          </div>
        </div>
      ) : (
        <p>Project not found</p>
      )}
    </div>
  );
}

export default ProjectDetail;
