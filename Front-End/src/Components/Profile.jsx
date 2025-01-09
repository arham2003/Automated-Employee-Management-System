import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'

const SubmittedWork = () => {
  // State to store submissions and selected month/year
  const [submissions, setSubmissions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('11');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data based on selected month/year
  const fetchSubmissions = () => {
    setLoading(true);
    setError('');
    
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/get_submittedWork`, {
      params: {
        year: selectedYear,
        month: selectedMonth
      }
    })
    .then(response => {
      setSubmissions(response.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to fetch data');
      setLoading(false);
    });
    console.log("Submissions",submissions)
  };

  // Call fetchSubmissions when component mounts or when year/month changes
  useEffect(() => {
    fetchSubmissions();
  }, [selectedYear, selectedMonth]);

  // Handle the status change of a submission
  const handleStatusChange = (partId, status) => {
    console.log("Data",partId,status)
    // Send updated status to the backend
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/update_submission_status`, {
      part_id: partId,
      status: status
    })
    .then(response => {
      console.log('Status updated successfully');
      fetchSubmissions(); // Refresh data after status update
    })
    .catch(err => {
      console.error('Failed to update status:', err);
    });
  };

  return (
    <div>
      <div>
        <label>Year: </label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          {/* Add more years as needed */}
        </select>

        <label>Month: </label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      <div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && submissions.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Part Name</th>
                <th>Project Name</th>
                <th>Part Status</th>
                <th>Submission Date</th>
                {/* <th>Part ID</th> */}
                <th>Department</th>
                <th>Submission URL</th>
                <th>Action</th> {/* Added new column for the action */}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.part_id}>
                  <td>{submission.employee_name}</td>
                  <td>{submission.part_name}</td>
                  <td>{submission.project_name}</td>
                  <td>{submission.part_status}</td>
                  <td>{new Date(submission.submission_datetime).toLocaleString()}</td>
                  {/* <td>{submission.part_id}</td> */}
                  <td>{submission.department_name}</td>
                  <td><a href={submission.submission_url} target="_blank" rel="noopener noreferrer">{submission.submission_url}</a></td>
                  <td>
                    <select
                      onChange={(e) => handleStatusChange(submission.part_id, e.target.value)}
                      defaultValue={submission.part_status}
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {submissions.length === 0 && !loading && !error && <p>No submissions found for this month.</p>}
      </div>
    </div>
  );
};

export default SubmittedWork;
