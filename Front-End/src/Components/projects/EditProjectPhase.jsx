import React, { useState, useEffect } from 'react';
import './ProjectForm.css'; // Assuming similar styles for consistency
import axios from 'axios';

const EditProjectPhase = ({ phase, onUpdate }) => {
  const [formData, setFormData] = useState({
    phaseName: phase?.part_name || '', // Phase name from part_name
    startDate: phase?.start_date ? new Date(phase.start_date).toISOString().split('T')[0] : '', // Format the date
    endDate: phase?.end_date ? new Date(phase.end_date).toISOString().split('T')[0] : '', // Format the date
    status: phase?.status || '', // Status from the phase
    employeeId: phase?.employee_id || '', // Employee ID
    contributionPercentage: phase?.contribution_percentage || '', // Contribution percentage
    projectId: phase?.project_id || '',  // Project ID
    projectName: phase?.project_name || '', // Project name (pre-filled)
  });

  const [employees, setEmployees] = useState([]);
  const [statuses] = useState(["Not Started", "In Progress", "Completed"]); // Predefined status options

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/employee`);
        setEmployees(response.data.Result);
      } catch (error) {
        console.error('Error fetching employees:', error.message);
      }
    };

    fetchEmployees();
  }, []); // Run once when the component mounts

  // Update formData when phase prop changes
  useEffect(() => {
    if (phase) {
      setFormData({
        phaseName: phase.part_name || '',
        startDate: phase.start_date ? new Date(phase.start_date).toISOString().split('T')[0] : '',
        endDate: phase.end_date ? new Date(phase.end_date).toISOString().split('T')[0] : '',
        status: phase.status || '',
        employeeId: phase.employee_id || '',
        contributionPercentage: phase.contribution_percentage || '',
        projectId: phase.project_id || '',
        projectName: phase.project_name || '', // Ensure projectName is set properly
      });
    }
  }, [phase]); // Run when `phase` prop changes

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Form Data:', formData);
  
    // Call the passed onUpdate function with the form data
    onUpdate(formData);
  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/update_projectpart/${phase.part_id}`,
        {
          phaseName: formData.phaseName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          employeeId: formData.employeeId,
          contributionPercentage: formData.contributionPercentage,
          projectId: formData.projectId,
          projectName: formData.projectName || "", // Ensure projectName is included, even if empty
        }
      );
      if (response.data.Status === 'Success') {
        alert('Project phase updated successfully!');
      } else {
        alert('Updated Reload to See.');
      }
    } catch (error) {
      console.error('Error updating project phase:', error);
      alert('Error during update. Please try again later.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Project Phase</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phaseName">Phase Name:</label>
          <input
            type="text"
            id="phaseName"
            name="phaseName"
            value={formData.phaseName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectId">Project ID (Read-Only):</label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={formData.projectId} // Display project ID
            readOnly // Make it read-only
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeId">Employee:</label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.post} ({employee.category_name})
                </option>
              ))
            ) : (
              <option disabled>No employees available</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contributionPercentage">Contribution (%):</label>
          <input
            type="number"
            id="contributionPercentage"
            name="contributionPercentage"
            value={formData.contributionPercentage}
            onChange={handleChange}
            required
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Phase
        </button>
      </form>
    </div>
  );
};

export default EditProjectPhase;
