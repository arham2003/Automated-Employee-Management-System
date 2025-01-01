import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './AttendanceForm.css'; // Import your professional CSS

const AttendanceForm = () => {
    const [employees, setEmployees] = useState([]); // Store employee data
    const [date, setDate] = useState(''); // Store the selected date
    const [attendanceData, setAttendanceData] = useState({}); // Store attendance status for employees
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [maxDate, setMaxDate] = useState(''); // Maximum selectable date

    const navigate = useNavigate(); // Initialize navigate

    // Fetch employee data from API using Axios
    useEffect(() => {
        axios
            .get('http://localhost:3000/auth/employee') // Update the URL to match your backend port (5000)
            .then((response) => {
                if (response.data.Status) {
                    setEmployees(response.data.Result); // Set employee data from response
                } else {
                    console.error('Error fetching employees');
                    setError('Failed to fetch employee data.');
                }
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
                setError('Error fetching employees.');
            })
            .finally(() => {
                setLoading(false); // Stop loading once data is fetched
            });

        // Set the maxDate to today's date (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        setMaxDate(today);
    }, []); // Empty dependency array to fetch data only once on component mount

    // Handle changes in attendance dropdown
    const handleAttendanceChange = (employeeId, status) => {
        setAttendanceData((prevData) => ({
            ...prevData,
            [employeeId]: status,
        }));
    };

    // Handle form submission and send attendance data to the backend
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!date) {
            alert("Please select a date.");
            return;
        }

        // Format the data to send it to the backend
        const attendancePayload = Object.keys(attendanceData).map((employeeId) => {
            return {
                employeeId: parseInt(employeeId), // Ensure the employeeId is a number
                date,
                status: attendanceData[employeeId],
            };
        });
        console.log("Payload    ", attendancePayload)

        // Make API call to submit the attendance data
        axios
            .post('http://localhost:3000/submit_attendance', attendancePayload) // Match backend port (5000)
            .then((response) => {
                console.log('Response from server:', response.data); // Log the server response
                alert('Attendance submitted successfully!');

                // Reset the form after submission
                setDate(''); // Clear the date
                setAttendanceData({}); // Clear attendance data for all employees
            })
            .catch((error) => {
                console.error('Error submitting attendance:', error.response ? error.response.data : error.message);
                alert('Error submitting attendance.');
            });
    };

    // Conditional rendering for loading and error states
    if (loading) {
        return <div>Loading employees...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="attendance-form">
            <h2>Employee Attendance</h2>

            {/* Date Selection */}
            <div className="date-picker">
                <label htmlFor="attendance-date">Select Date:</label>
                <input
                    type="date"
                    id="attendance-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    max={maxDate} // Restrict selection to current date or earlier
                />
            </div>

            {/* Attendance Table */}
            <form onSubmit={handleSubmit}>
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                <td>
                                    <select
                                        value={attendanceData[employee.id] || ''}
                                        onChange={(e) =>
                                            handleAttendanceChange(employee.id, e.target.value)
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Leave">Leave</option>
                                        <option value="Late">Late</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className="submit-btn">Submit Attendance</button>
            </form>

            {/* Back button to navigate to attendance records */}
            <button onClick={() => navigate('/dashboard/attendance')} className="back-btn">
                Go Back 
            </button>
        </div>
    );
};

export default AttendanceForm;
