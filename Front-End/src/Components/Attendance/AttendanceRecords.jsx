import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './AttendanceRecords.css'

const AttendanceRecords = () => {
    const [employees, setEmployees] = useState([]); // Store employee data
    const [month, setMonth] = useState(''); // Store selected month
    const [attendanceRecords, setAttendanceRecords] = useState([]); // Store attendance records
    const [dates, setDates] = useState([]); // Store dates of the month
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Fetch employee data on component mount
    useEffect(() => {
        axios
            .get('http://localhost:3000/auth/employee')
            .then((response) => {
                if (response.data.Status) {
                    setEmployees(response.data.Result); // Set employee data from response
                } else {
                    console.error('Error fetching employees');
                }
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    // Function to generate all dates of the selected month
    const generateDatesForMonth = (month) => {
        const date = new Date(`${month}-01`);
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const dateArray = [];
    
        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(date.getFullYear(), date.getMonth(), i)
                .toISOString().split('T')[0]; // Format to YYYY-MM-DD
            dateArray.push(day);
        }
    
        return dateArray;
    };
    

    // Fetch attendance records for a specific month
    const fetchAttendanceRecords = () => {
        if (!month) {
            alert('Please select a month.');
            return;
        }
        console.log(month)
        setLoading(true);
        setError(null);
        console.log("Month",month)

        // Make a request to get attendance records for the selected month
        axios.get(`http://localhost:3000/get_attendanceByMonth?month=${month}`)
            .then((response) => {
                if (response.status === 200) {
                    setAttendanceRecords(response.data); // Set attendance records
                    setDates(generateDatesForMonth(month)); // Generate and set the dates for the selected month
                } else {
                    setError('No attendance records found for the selected month.');
                }
            })
            .catch((error) => {
                console.error('Error fetching attendance records:', error);
                setError('Error fetching attendance records.');
            })
            .finally(() => {
                setLoading(false); // Stop loading after data is fetched
            });
    };

    // Handle click for "Take Attendance" button to navigate to AttendanceForm
    const handleTakeAttendanceClick = () => {
        navigate('/dashboard/take_attendance'); // Navigate to the form page
    };
    const handleUpdateAttendanceClick = () => {
        navigate('/dashboard/update_attendance'); // Navigate to the form page
    };

    return (
        <div className="attendance-records">
            <h2>Attendance Records for the Month</h2>

            {/* Month Selection */}
            <div className="month-picker">
                <label htmlFor="attendance-month">Select Month:</label>
                <input
                    type="month"
                    id="attendance-month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                />
                <button onClick={fetchAttendanceRecords} className="fetch-btn">
                    Fetch Attendance
                </button>
            </div>

            {/* Loading and Error states */}
            {loading && <div>Loading attendance records...</div>}
            {error && <div>Error: {error}</div>}

            {/* Attendance Table */}
            {!loading && attendanceRecords.length > 0 && (
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Employee Name</th>
                            {dates.map((date) => (
                                <th key={date}>{date}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.name}</td>
                                {dates.map((date) => {
                                    const record = attendanceRecords.find(
                                        (rec) =>
                                            rec.employee_id === employee.id && 
                                            new Date(rec.date).toISOString().split('T')[0] === date // Compare only the date part
                                    );
                                    return (
                                        <td key={`${employee.id}-${date}`}>
                                            {record ? record.status : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* No Records Message */}
            {!loading && attendanceRecords.length === 0 && (
                <div>No attendance records available for this month.</div>
            )}

            {/* Button to take attendance */}
            <button onClick={handleTakeAttendanceClick} className="take-attendance-btn">
                Take Attendance
            </button>
            {/* Button to take attendance */}
            <button onClick={handleUpdateAttendanceClick} className="take-attendance-btn">
                Update Attendance
            </button>
        </div>
    );
};

export default AttendanceRecords;
