import React, { useState } from 'react';
import axios from 'axios';
// import './UpdateSalary.css'; // Import the CSS file for styling

const UpdateSalary = ({ employee }) => {
  const [empName, setEmpName] = useState(employee.employee_name || ''); // Pre-fill with selected employee's name
  const [salary, setSalary] = useState(employee.salary || '');
  const [bonus, setBonus] = useState(employee.bonus || '');
  const [status, setStatus] = useState(employee.status || 'Not Paid'); // Pre-fill payment status
  const [paymentId, setPaymentId] = useState(employee.payment_id || ''); // Assuming payment_id is also passed
  const [message, setMessage] = useState('');

  // Handle form submission to update the salary
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!salary || !bonus || !status) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Send the form data to the backend to update the salary
      const response = await axios.put('http://localhost:3000/update_payment', {
        payment_id: paymentId, // Pass payment_id for the update query
        salary,
        bonus,
        status,
      });

      if (response.status === 200) {
        setMessage('Salary updated successfully!');
      } else {
        setMessage('Error updating salary.');
      }
    } catch (error) {
      setMessage('There was an error updating the salary.');
    }
  };

  return (
    <div className="update-salary-container">
      <h2>Update Employee Salary</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="empName">Employee Name:</label>
          <input
            type="text"
            id="empName"
            value={empName}
            readOnly // Makes the empName field read-only
            required
          />
        </div>

        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="bonus">Bonus:</label>
          <input
            type="number"
            id="bonus"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Payment Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Not Paid">Not Paid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <button type="submit">Update Salary</button>
      </form>

      {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
    </div>
  );
};

export default UpdateSalary;
