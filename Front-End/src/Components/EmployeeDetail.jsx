import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useEmployee } from './EmployeePanel/EmployeeContext';
import './EmployeeDetail.css';

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState(null);
  const [totalContribution, setTotalContribution] = useState(null);
  const [approvedParts, setApprovedParts] = useState([]);
  const [month, setMonth] = useState(1);  // Keep this as a number initially
  const [year, setYear] = useState(new Date().getFullYear());
  const bonusLimit = useRef(15); // Initialize bonusLimit with useRef to persist value across renders
  const { employeeId: contextEmployeeId } = useEmployee();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const effectiveEmployeeId = id || contextEmployeeId;
    console.log('Current bonusLimit:', bonusLimit.current);  // Access the current value of bonusLimit

    if (!effectiveEmployeeId) {
      navigate('/');
      return;
    }

    // Fetch employee details
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/employee/detail/${effectiveEmployeeId}`)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));

    // Fetch the total contribution for this employee for the selected month and year
    if (effectiveEmployeeId && month && year) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/get_empContributions?year=${year}&month=${month}&employeeId=${effectiveEmployeeId}`
        )
        .then((result) => {
          const contribution = result.data[0]?.total_contribution ?? 0;
          setTotalContribution(contribution);

          // Check if contribution is greater than bonusLimit, and if so, update the bonus
          if (contribution > bonusLimit.current) {
            console.log('Bonus limit before update:', bonusLimit.current);
            // updateBonus(effectiveEmployeeId);

            // Increment bonusLimit by 15
            bonusLimit.current += 15;
            console.log('Bonus limit updated to:', bonusLimit.current);
          }
        })
        .catch((err) => console.log(err));
    }

    // Fetch approved project parts
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/approved_parts?year=${year}&month=${month}`)
      .then((result) => {
        setApprovedParts(result.data);
      })
      .catch((err) => console.log(err));
  }, [id, contextEmployeeId, navigate, month, year]);

  // Convert month number to the full month name (e.g., 12 => "December")
  const getMonthName = (monthNumber) => {
    return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
  };

  // Function to update the employee's bonus if the contribution is greater than the bonus limit
  const updateBonus = (employeeId) => {
    const monthName = getMonthName(month);  // Convert to month name before sending
    console.log(employeeId, monthName, year);

    axios.put(`${import.meta.env.VITE_BACKEND_URL}/update_bonus`, {
      employeeId,
      month: monthName,   // Send month as a string (e.g., "December")
      year
    })
    .then(result => {
      console.log('Bonus updated:', result.data);
    })
    .catch(err => {
      console.error('Error updating bonus:', err.response ? err.response.data : err.message);
    });
  };

  const handleLogout = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/employee/logout`)
      .then((result) => {
        if (result.data.Status) {
          localStorage.clear();
          window.location.href = '/';
        }
      })
      .catch((err) => console.log(err));
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-page">
      <div className="p-2 d-flex justify-content-center shadow header bg-secondary bg-gradient">
        <h4>
          <i className="bi bi-building-gear"> </i>
          Employee Management System
        </h4>
      </div>
      <div className="d-flex">
        <div className="sidebar bg-dark bg-gradient">
          <ul className="sidebar-menu">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to={`/employee_detail/${id || contextEmployeeId}/assigned_work`}>Assigned Work</Link>
            </li>
            <li>
              <Link to={`/employee_detail/${id || contextEmployeeId}/attendance`}>Attendance</Link>
            </li>
            <li>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>

        <div className="content flex-grow-1">
          <div className="d-flex justify-content-center flex-column align-items-center mt-3">
            <img
              src={`http://localhost:3000/Images/${employee.image}`}
              className="emp-det-image"
              alt="Employee"
            />
            <div className="d-flex align-items-center flex-column mt-5">
              <h3>Name: {employee.name}</h3>
              <h3>Email: {employee.email}</h3>
              <h3>Salary: ${employee.salary}</h3>
            </div>

            {/* Month and Year Selection */}
            <div className="month-year-selection mt-4">
              <label htmlFor="month">Select Month:</label>
              <select id="month" value={month} onChange={handleMonthChange}>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index + 1}>
                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>

              <label htmlFor="year" className="ml-3">
                Select Year:
              </label>
              <select id="year" value={year} onChange={handleYearChange}>
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index} value={year - index}>
                    {year - index}
                  </option>
                ))}
              </select>
            </div>

            {totalContribution !== null ? (
              <div className="total-contribution mt-4">
                <h4>
                  Total Contribution for {employee.name}: {totalContribution}%
                </h4>
              </div>
            ) : (
              <div className="total-contribution mt-4">
                <h4>No contribution data available for the selected period.</h4>
              </div>
            )}

            {approvedParts.length > 0 ? (
              <div className="approved-project-parts mt-4">
                <h4>
                  Approved Project Parts for{' '}
                  {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}:
                </h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Part Name</th>
                      <th>Status</th>
                      <th>Submission Date</th>
                      <th>Contribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedParts.map((part) => (
                      <tr key={part.part_id}>
                        <td>{part.part_name}</td>
                        <td>{part.status}</td>
                        <td>{new Date(part.submission_datetime).toLocaleDateString()}</td>
                        <td>{part.contribution_percentage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="approved-project-parts mt-4">
                <h4>No approved project parts for the selected period.</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
