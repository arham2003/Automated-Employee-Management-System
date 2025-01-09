import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    department_id: "",
    post: "", // Added post field
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/departments`)
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch departments. Please try again.");
      });


      axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/employee/` + id)
      .then((result) => {
        if (result.data.Result && result.data.Result[0]) {
          setEmployee({
            ...employee,
            name: result.data.Result[0].name,
            email: result.data.Result[0].email,
            address: result.data.Result[0].address,
            salary: result.data.Result[0].salary,
            department_id: result.data.Result[0].department_id || "",
            post: result.data.Result[0].post || "",
          });
        } else {
          toast.error("Employee details not found.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch employee details.");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/auth/edit_employee/` + id, employee)
      .then((result) => {
        if (result.data.Status) {
          toast.success("Employee updated successfully!");
          setTimeout(() => navigate("/dashboard/employee"), 2000); // Redirect after 2 seconds
        } else {
          toast.error(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update employee. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Department
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.department_id}
              onChange={(e) =>
                setEmployee({ ...employee, department_id: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {category.map((c) => (
                <option key={c.department_id} value={c.department_id}>
                  {c.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Dropdown */}
          <div className="col-12">
            <label htmlFor="post" className="form-label">
              Post
            </label>
            <select
              id="post"
              className="form-select"
              value={employee.post}
              onChange={(e) =>
                setEmployee({ ...employee, post: e.target.value })
              }
            >
              <option value="">Select Post</option>
              <option value="Head">Head</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
