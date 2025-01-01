import React, { useState } from "react";
import './Attendance.css'
const Attendance = () => {
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState(2024);
  const [attendance, setAttendance] = useState([
    {
      employeeId: 1,
      name: "John Doe",
      days: Array(31).fill("P"),
    },
    {
      employeeId: 2,
      name: "Jane Smith",
      days: Array(31).fill("A"),
    },
    {
      employeeId: 3,
      name: "Alice Brown",
      days: Array(31).fill("L"),
    },
  ]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleAttendanceChange = (employeeId, day, status) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((emp) =>
        emp.employeeId === employeeId
          ? {
              ...emp,
              days: emp.days.map((dayStatus, index) =>
                index === day ? status : dayStatus
              ),
            }
          : emp
      )
    );
  };

  const daysInMonth = 31; // Assuming 31 days for simplicity

  return (
    <div className="attendance-container">
      <div className="month-year-selector">
        <label htmlFor="month">Select Month: </label>
        <select
          id="month"
          value={month}
          onChange={handleMonthChange}
          className="select"
        >
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(
            (monthName, index) => (
              <option key={index} value={monthName}>
                {monthName}
              </option>
            )
          )}
        </select>

        <label htmlFor="year">Select Year: </label>
        <select
          id="year"
          value={year}
          onChange={handleYearChange}
          className="select"
        >
          {["2024", "2025", "2026", "2027"].map((yearValue) => (
            <option key={yearValue} value={yearValue}>
              {yearValue}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              {[...Array(daysInMonth)].map((_, index) => (
                <th key={index}>Day {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendance.map((emp) => (
              <tr key={emp.employeeId}>
                <td>{emp.employeeId}</td>
                <td>{emp.name}</td>
                {emp.days.map((status, dayIndex) => (
                  <td key={dayIndex}>
                    <select
                      value={status}
                      onChange={(e) =>
                        handleAttendanceChange(emp.employeeId, dayIndex, e.target.value)
                      }
                      className="attendance-dropdown"
                    >
                      <option value="P">P</option>
                      <option value="A">A</option>
                      <option value="L">L</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
