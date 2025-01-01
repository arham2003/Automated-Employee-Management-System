import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);  // Array to store top 5 employees


  useEffect(() => {
    adminCount();
    employeeCount();
    salaryCount();
    AdminRecords();
    fetchTopEmployee();
  }, []);

  const AdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records').then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const adminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count').then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const employeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count').then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const salaryCount = () => {
    axios.get('http://localhost:3000/auth/salary_count').then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const fetchTopEmployee = () => {
    axios.get('http://localhost:3000/auth/top_employee').then((result) => {
        if (result.data.Status) {
            setTopEmployees(result.data.Result);  // Store the result as an array
        }
    });
};


  // Data for Bar Chart
  const barData = {
    labels: ['Admins', 'Employees'],
    datasets: [
      {
        label: 'Count',
        data: [adminTotal, employeeTotal],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Data for Pie Chart
  const pieData = {
    labels: ['Admins', 'Employees'],
    datasets: [
      {
        label: '# of People',
        data: [adminTotal, employeeTotal],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the Bar chart
  const barData2 = {
    labels: topEmployees.map(employee => employee.name),  // Employee names as labels
    datasets: [
      {
        label: 'Salaries',
        data: topEmployees.map(employee => employee.salary),  // Salaries as data
        backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Blue color for the bars
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3 className='text-center'>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id}>
                <td>{a.email}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2">Edit</button>
                  <button className="btn btn-warning btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 px-5 pt-3">
        <h3 className='text-center'>Stats</h3>
        <div className="d-flex justify-content-around mt-4">
          <div className="w-50">
            <Bar data={barData} />
          </div>
          <div className="w-25">
            <Pie data={pieData} />
          </div>
        </div>
        <div className="mt-4 px-5 pt-3">
    <h3 className="text-center">Top Employees with Highest Salaries</h3>
    <div className="d-flex justify-content-around mt-4">
          <div className="w-50">
            <Bar data={barData2} />
          </div>
      </div>
    </div>
    </div>
    </div>
  );
};



export default Home;
