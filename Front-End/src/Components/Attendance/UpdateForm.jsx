import React, { useState, useEffect } from 'react';
import './AttendanceForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateForm = () => {
    const [date, setDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({});
    const [employees, setEmployees] = useState([]);
    const [maxDate] = useState('2024-11-30');
    const navigate = useNavigate();

    useEffect(() => {
        if (!date) return;

        axios
            .get(`${import.meta.env.VITE_BACKEND_URL}/get_attendanceByDate?date=${date}`)
            .then((response) => {
                const data = response.data;

                setEmployees(data);
                setAttendanceData(
                    data.reduce((acc, record) => {
                        acc[record.name] = record.status;
                        return acc;
                    }, {})
                );
            })
            .catch((error) => {
                console.error('Error fetching attendance data:', error);
                setAttendanceData({});
            });
    }, [date]);

    const handleAttendanceChange = (employeeName, status) => {
        setAttendanceData((prevData) => ({
            ...prevData,
            [employeeName]: status,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedAttendance = employees.map((employee) => ({
            name: employee.name,
            status: attendanceData[employee.name] || 'Absent',
        }));

        axios
            .put(`${import.meta.env.VITE_BACKEND_URL}/update_attendance`, { date, attendance: updatedAttendance })
            .then(() => {
                alert('Attendance Updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating attendance:', error);
                alert('Failed to submit attendance. Please try again.');
            });

        setDate('');
        setAttendanceData({});
    };

    const handleDeleteAttendance = () => {
        axios
            .delete(`${import.meta.env.VITE_BACKEND_URL}/delete_attendance`, { data: { date } })
            .then((response) => {
                alert('Attendance records deleted successfully!');
                setDate('');
                setEmployees([]);
                setAttendanceData({});
            })
            .catch((error) => {
                console.error('Error deleting attendance:', error);
                alert('Failed to delete attendance records. Please try again.');
            });
    };

    return (
        <div className="attendance-form">
            <h2>Update Employee Attendance</h2>

            {/* Date Selection */}
            <div className="date-picker">
                <label htmlFor="attendance-date">Select Date:</label>
                <input
                    type="date"
                    id="attendance-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    max={maxDate} // Restrict selection to the max date
                />
            </div>

            {/* Attendance Table */}
            {employees.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Employee Name</th>
                                <th>Attendance Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.name}>
                                    <td>{employee.name}</td>
                                    <td>
                                        <select
                                            value={attendanceData[employee.name] || ''}
                                            onChange={(e) =>
                                                handleAttendanceChange(employee.name, e.target.value)
                                            }
                                            required
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
                    <button type="submit" className="submit-btn">Update Attendance</button>
                </form>
            ) : (
                <p>Select a date to view and update attendance records.</p>
            )}

            {/* Buttons Wrapper */}
            <div className="button-wrapper">
                <button onClick={handleDeleteAttendance} className="delete-btn">
                    Delete Attendance for Selected Date
                </button>
                <button onClick={() => navigate('/dashboard/attendance')} className="back-btn">
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default UpdateForm;
