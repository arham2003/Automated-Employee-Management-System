import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API calls
import './SalaryForm.css'; // Import the CSS file for styling

const SalaryForm = () => {
  const [empName, setEmpName] = useState('');
  const [salary, setSalary] = useState('');
  const [bonus, setBonus] = useState('');  // State for bonus
  const [salaryDate, setSalaryDate] = useState('');
  const [status, setStatus] = useState('Not Paid');  // State for payment status
  const [message, setMessage] = useState('');
  const [employees, setEmployees] = useState([]);  // State for employee names

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get_employee_salaries`);
        if (response.status === 200) {
          setEmployees(response.data);  // Assuming response data contains an array of employee names
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setMessage('Error fetching employee data.');
      }
    };

    fetchEmployees();
  }, []);

  // Function to format the date as MM/YYYY
  const formatDate = (date) => {
    const [year, month] = date.split('-');  // Split the date into year and month
    return `${month}/${year}`;  // Return only month/year (e.g., 12/2024)
  };

  // Check if salary has already been paid for the selected employee and salary date
  const checkIfPaid = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/check_payment_status`, {
        params: {
          empName,
          salaryDate: formatDate(salaryDate)
        }
      });
      return response.data.paid;
    } catch (error) {
      console.error('Error checking payment status:', error);
      setMessage('Error checking payment status.');
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Validate the form fields
    if (!empName || !salary || !bonus || !salaryDate || !status) {
      setMessage('Please fill in all fields.');
      return;
    }

    // Check if the salary has already been paid for the current salary date
    const isPaid = await checkIfPaid();
    if (isPaid && status === 'Paid') {
      setMessage('Salary already paid for this month.');
      return; // Prevent submission if salary has already been paid
    }

    // Convert the date to MM/YYYY format before submission
    const formattedDate = formatDate(salaryDate);

    try {
      // Send the form data to the backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/pay_salary`, {
        empName,
        salary,
        bonus,  // Send bonus as part of the data
        salaryDate: formattedDate, // Send formatted date (MM/YYYY)
        status,  // Send payment status
      });

      if (response.status === 200) {
        setMessage('Salary data submitted successfully!');
        // Reset the form after submission
        setEmpName('');
        setSalary('');
        setBonus('');  // Reset bonus field
        setSalaryDate('');
        setStatus('Not Paid');  // Reset status field
      } else {
        setMessage('Error submitting salary data.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('There was an error submitting the form.');
    }
  };

  return (
    <div className="salary-form-container">
      <h2>Employee Salary Entry</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="empName">Employee Name:</label>
          <select
            id="empName"
            value={empName}
            onChange={(e) => setEmpName(e.target.value)}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee, index) => (
              <option key={index} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
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
          <label htmlFor="salaryDate">Salary Date:</label>
          <input
            type="month"  // Use type="month" to allow month and year selection
            id="salaryDate"
            value={salaryDate}
            onChange={(e) => setSalaryDate(e.target.value)}
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

        <button type="submit">Submit</button>
      </form>

      {message && (
        <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>
      )}
    </div>
  );
};

export default SalaryForm;
