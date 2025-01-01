import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import EditProjectPhase from './EditProjectPhase'; // Import the EditProjectPhase component

function ProjectPhase({ projectParts, handleDelete, handleAddPart }) {
  const [editingPhase, setEditingPhase] = useState(null); // State to track the selected phase for editing
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isAddingPart, setIsAddingPart] = useState(false); // State to control if it's Add or Edit
  const [newPart, setNewPart] = useState({
    part_name: '',
    part_id: '',
    start_date: '',
    end_date: '',
    status: '',
    contribution_percentage: '',
    employee_id: '', // Add employee_id field
  }); // State for new project part details

  const [updatedParts, setUpdatedParts] = useState(projectParts); // State to manage updated project parts
  const [employees, setEmployees] = useState([]); // State to store employee data

  // Fetch employees from the API when the component mounts
  useEffect(() => {
    fetch("http://localhost:3000/auth/employee")
      .then((response) => response.json())
      .then((data) => {
        if (data.Status) {
          setEmployees(data.Result); // Store employee data in state
        } else {
          console.error("Failed to fetch employee data");
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  // Define the formatDate function within the component
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Function to handle phase editing (triggered when Edit is clicked)
  const handleEditClick = (part) => {
    setEditingPhase(part);  // Set the selected phase to edit
    setIsAddingPart(false); // Make sure it's not in Add mode
    setShowModal(true);     // Open the modal
  };

  // Function to handle adding a new part
  const handleAddClick = () => {
    setIsAddingPart(true);  // Set to add mode
    setNewPart({
      part_name: '',
      part_id: '',
      start_date: '',
      end_date: '',
      status: '',
      contribution_percentage: '',
      employee_id: '', // Clear employee ID when adding new part
    }); // Clear form fields for adding
    setShowModal(true);     // Open the modal
  };

  // Function to handle updating the phase
  const handleUpdatePhase = (updatedPhase) => {
    // Update the phase in the state
    setUpdatedParts((prevParts) =>
      prevParts.map((part) =>
        part.part_id === updatedPhase.part_id ? updatedPhase : part
      )
    );
    setShowModal(false); // Close the modal after update
  };

  // Function to handle adding a new project part
  const handleAddNewPart = (e) => {
    e.preventDefault();
    // Add new part to the state
    const addedPart = { ...newPart, part_id: Date.now() }; // Assign a unique part_id (e.g., using timestamp)
    setUpdatedParts((prevParts) => [...prevParts, addedPart]);
    setShowModal(false); // Close the modal after adding
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);     // Close the modal
    setEditingPhase(null);   // Clear the editing state
  };

  // Check if projectParts is an array and has items
  if (!Array.isArray(updatedParts) || updatedParts.length === 0) {
    return <p>No project parts available.</p>;
  }

  return (
    <div>
      <h5>Project Phases</h5>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Employee</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Contribution (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedParts.map((part, index) => (
            <tr key={index}>
              <td>{part.part_name || "N/A"}</td>
              <td>{part.employee_id || "N/A"}</td>
              <td>{part.start_date ? formatDate(part.start_date) : "N/A"}</td>
              <td>{part.end_date ? formatDate(part.end_date) : "N/A"}</td>
              <td>{part.status || "N/A"}</td>
              <td>{part.contribution_percentage || "N/A"}</td>
              <td>
                <Button variant="info" onClick={() => handleEditClick(part)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(part.part_id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Project Part Button */}
      <Button
        variant="primary"
        onClick={handleAddClick}
        style={{ marginBottom: '20px' }}
      >
        Add Project Phase
      </Button>

      {/* Modal for editing or adding project phase */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isAddingPart ? "Add Project Part" : "Edit Project Phase"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAddingPart ? (
            <Form onSubmit={handleAddNewPart}>
              <Form.Group controlId="partName">
                <Form.Label>Phase Name</Form.Label>
                <Form.Control
                  type="text"
                  name="part_name"
                  value={newPart.part_name}
                  onChange={(e) => setNewPart({ ...newPart, part_name: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="employeeId">
                <Form.Label>Employee</Form.Label>
                <Form.Control
                  as="select"
                  name="employee_id"
                  value={newPart.employee_id}
                  onChange={(e) => setNewPart({ ...newPart, employee_id: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={newPart.start_date}
                  onChange={(e) => setNewPart({ ...newPart, start_date: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={newPart.end_date}
                  onChange={(e) => setNewPart({ ...newPart, end_date: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={newPart.status}
                  onChange={(e) => setNewPart({ ...newPart, status: e.target.value })}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="contributionPercentage">
                <Form.Label>Contribution (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="contribution_percentage"
                  value={newPart.contribution_percentage}
                  onChange={(e) => setNewPart({ ...newPart, contribution_percentage: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Part
              </Button>
            </Form>
          ) : (
            editingPhase ? (
              <EditProjectPhase
                phase={editingPhase}
                onUpdate={handleUpdatePhase}
              />
            ) : (
              <p>Loading...</p>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectPhase;
