import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalaryForm from './SalaryForm'; // Assuming this is for adding salary
import UpdateSalary from './UpdateSalary'; // Import UpdateSalary component
import './Salaries.css';

const SalaryTracker = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('November'); // Default to current month
  const [selectedYear, setSelectedYear] = useState('2024'); // Default to current year
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee to edit

  // Fetch employee data from the API based on selected month and year
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get_empPayments`, {
          params: { 
            month: selectedMonth, 
            year: selectedYear 
          }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [selectedMonth, selectedYear]); // Refetch data whenever month or year changes

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null); // Reset selected employee
  };

  // Function to handle deleting an employee record
  const deleteSalary = async (paymentId) => {
    try {
      // Send DELETE request to the backend to delete the employee's salary record by payment_id
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete_payment/${paymentId}`);
      
      // Update the state by removing the deleted employee from the list
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.payment_id !== paymentId)
      );
    } catch (error) {
      console.error('Error deleting employee data:', error);
    }
  };

  // Function to open edit modal with employee data
  const openEditModal = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    openModal(); // Open the modal
  };

  return (
    <div className="salary-tracker-container">
      <h2>Employee Salary Tracker</h2>

      {/* Add Salary Button */}
      <button className="add-salary-button" onClick={openModal}>Add Salary</button>

      {/* Month and Year Selection */}
      <div className="filter-container">
        <label>
          Select Month: 
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </label>

        <label>
          Select Year: 
          <input 
            type="number" 
            value={selectedYear} 
            onChange={handleYearChange}
            min="2000" max={new Date().getFullYear()}
          />
        </label>
      </div>

      {/* Employee Salary Table for Selected Month */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Basic Salary</th>
            <th>Bonus</th>
            <th>Total Salary</th>
            <th>Status</th>
            <th>Actions</th> {/* Add Actions column for edit and delete buttons */}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.payment_id}>
                <td>{employee.employee_name}</td>
                <td>{employee.salary}</td>
                <td>{employee.bonus}</td>
                <td>{employee.salary + employee.bonus}</td>
                <td>{employee.status}</td>
                <td>
                  {/* Edit button to load employee data for editing */}
                  <button
                    className="edit-button"
                    onClick={() => openEditModal(employee)}
                  >
                    Edit
                  </button>

                  {/* Delete button for each row */}
                  <button
                    className="delete-button"
                    onClick={() => deleteSalary(employee.payment_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for SalaryForm or UpdateSalary */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeModal}>Close</button>
            {selectedEmployee ? (
              <UpdateSalary employee={selectedEmployee} /> // Pass selected employee to UpdateSalary component
            ) : (
              <SalaryForm /> // Display SalaryForm if no employee is selected
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryTracker;
