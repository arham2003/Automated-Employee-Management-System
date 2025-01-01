import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const AssignedWork = () => {
  const { id } = useParams(); // Extract the employee ID from the URL
  const [assignedWork, setAssignedWork] = useState([]); // State to hold assigned work data
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedPartId, setSelectedPartId] = useState(null); // State to hold selected part ID for the file upload
  const [url, setUrl] = useState(""); // State to hold the URL input
  const [error, setError] = useState(null); // State to hold error messages
  const [partDetails, setPartDetails] = useState(null); // State to hold project part details

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log(currentDate); // Output: 2024-11-28

    // Fetch assigned work data when the component mounts
    axios
      .get(`http://localhost:3000/employee_detail/${id}/assigned_work`)
      .then((response) => {
        if (response.data.Status) {
          setAssignedWork(response.data.Result); // Use the "Result" key to get the data
        } else {
          setError("No assigned work found for this employee.");
        }
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching assigned work:", error);
        setError("Error fetching assigned work.");
        setLoading(false); // Stop loading in case of error
      });
  }, [id]); // Refetch when the `id` changes

  // Function to load project part details by ID
  const fetchPartDetails = (partId) => {
    axios
      .get(`http://localhost:3000/get_projectpart/${partId}`)
      .then((response) => {
        if (response.data) {
          setPartDetails(response.data); // Set the project part details
        } else {
          setError("Failed to load project part details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching project part details:", error);
        setError("Error fetching project part details.");
      });
  };
  const markAttendance = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log("In markAttendance");
    console.log("Current Date:", currentDate);

    axios
      .post(`http://localhost:3000/mark_present/37?date=${currentDate}`)
      .then((response) => {
        console.log("Response:", response); // Log response
        alert("Attendance marked as present!");
      })
      .catch((error) => {
        console.error("Error marking attendance:", error); // Log error details
        alert("Error marking attendance");
      });

    console.log("Out markAttendance");
  };

  // Handle the "Add Work" button click
  const handleAddWork = (partId) => {
    setSelectedPartId(partId); // Set selected part ID for the file upload
    fetchPartDetails(partId); // Load the project part details
    setIsModalOpen(true); // Open the URL input modal
  };

  // Handle URL input change
  const handleUrlChange = (event) => {
    setUrl(event.target.value); // Set the input URL
  };

  // Handle URL submission and update status in the backend
  const handleUrlSubmit = () => {
    if (!url) {
      alert("Please enter a URL.");
      return;
    }

    const data = {
      emp_id: id, // Pass employee ID
      part_id: selectedPartId, // Pass part ID
      submission_url: url, // Use the URL instead of a file
      submission_datetime: new Date().toISOString(), // Use current datetime
    };

    // First, submit the URL to the backend
    axios
      .post("http://localhost:3000/submit_work", data)
      .then((response) => {
        if (response.data.Status) {
          alert("URL submitted successfully");

          // After URL is successfully submitted, update the status to 'Submitted'
          axios
            .put(
              `http://localhost:3000/update_projectPart_status/${selectedPartId}`
            )
            .then((updateResponse) => {
              if (updateResponse.data.Status) {
                alert("Status updated to Submitted");
                setIsModalOpen(false); // Close the modal after successful update

                console.log("ID = ", id);

                // Mark employee as present after submission
                // const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
              } else {
                alert("Failed to update status");
              }
            })
            .catch((error) => {
              console.error("Error updating status:", error);
              alert("Error updating status");
            });
          markAttendance();
        } else {
          alert("Failed to submit URL");
        }
        setIsModalOpen(false); // Close the modal after submission
      })
      .catch((error) => {
        console.error("Error submitting URL:", error);
        alert("Error submitting URL");
        setIsModalOpen(false); // Close the modal after error
      });

    console.log("ID = ", id);
  };

  // Render a loading message while the data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <p>Loading assigned work...</p>
      </div>
    );
  }

  return (
    <div className="employee-page">
      {/* Header */}
      <div className="p-2 d-flex justify-content-center shadow header">
        <h4>Employee Management System</h4>
      </div>

      {/* Layout with Sidebar and Main Content */}
      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to={`/employee_detail/${id}/assigned_work`}>
                Assigned Work
              </Link>
            </li>
            <li>
              <Link
                to={`/employee_detail/${id || contextEmployeeId}/attendance`}
              >
                Attendance
              </Link>
            </li>{" "}
            {/* Added Attendance Link */}
            <li>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="content flex-grow-1">
          <div className="d-flex justify-content-center flex-column align-items-center mt-3">
            <h2>Assigned Work</h2>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Assigned Work Table */}
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Part Name</th>
                  <th>Project Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Contribution (%)</th>
                  <th>Action</th> {/* New column for the Add Work button */}
                </tr>
              </thead>
              <tbody>
                {assignedWork.length > 0 ? (
                  assignedWork.map((work) => (
                    <tr key={work.part_id}>
                      <td>{work.part_name}</td>
                      <td>{work.project_name}</td>
                      <td>{new Date(work.start_date).toLocaleDateString()}</td>
                      <td>{new Date(work.end_date).toLocaleDateString()}</td>
                      <td>{work.status}</td>
                      <td>{work.contribution_percentage}%</td>
                      <td>
                        {/* Only show the button if the status is not "Submitted" */}
                        {work.status !== "Submitted" &&
                          work.status !== "Approved" && (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAddWork(work.part_id)} // Call the handler with the part_id
                            >
                              Add Work
                            </button>
                          )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No assigned work found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for URL Input */}
      {isModalOpen && partDetails && (
        <div
          className="modal"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-content"
            style={{
              position: "relative",
              margin: "15% auto",
              padding: "20px",
              backgroundColor: "white",
              width: "300px",
            }}
          >
            <h5>Submit Work URL</h5>
            <div>
              <p>
                <strong>Part Name:</strong> {partDetails.part_name}
              </p>
              <p>
                <strong>Project Name:</strong> {partDetails.project_name}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(partDetails.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(partDetails.end_date).toLocaleDateString()}
              </p>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Enter URL"
              value={url}
              onChange={handleUrlChange}
            />
            <div className="mt-2">
              <button className="btn btn-success" onClick={handleUrlSubmit}>
                Submit URL
              </button>
              <button
                className="btn btn-secondary ml-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedWork;
