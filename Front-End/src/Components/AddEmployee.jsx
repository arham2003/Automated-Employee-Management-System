import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
import { toast } from 'react-hot-toast';

  const AddEmployee = () => {
    const [employee, setEmployee] = useState({
      name: "",
      email: "",
      password: "",
      salary: "",
      address: "",
      department_id: "",
      image: "",
      post: "",
    });
    const [category, setCategory] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      axios
        .get("http://localhost:3000/auth/departments")
        .then((result) => {
          if (result.data.Status) {
            setCategory(result.data.Result);
          } else {
            toast.error(result.data.Error);
          }
        })
        .catch((err) => toast.error("Error fetching departments!"));
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!employee.email) {
        toast.error("Email is required!");
        return;
      }
    
      try {
        // Check if email exists
        const emailCheckResponse = await axios.post(
          `http://localhost:3000/auth/check_email`,
          { email: employee.email },
          { withCredentials: true } // Ensure credentials (cookies) are included
        );
    
        if (emailCheckResponse.data.exists) {
          // If email exists, show a toast error and stop submission
          toast.error("Email already exists! Please use a different email.");
          return;
        }
    
        // Proceed with adding the employee
        const formData = new FormData();
        formData.append("name", employee.name);
        formData.append("email", employee.email);
        formData.append("password", employee.password);
        formData.append("address", employee.address);
        formData.append("salary", employee.salary);
        if (employee.image) {
          formData.append("image", employee.image);
        }
        formData.append("department_id", employee.department_id || "");
        formData.append("post", employee.post);
    
        const addResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/add_employee`,
          formData,
          { withCredentials: true }
        );
    
        if (addResponse.data.Status) {
          toast.success(addResponse.data.Message || "Employee added successfully!");
          setTimeout(() => navigate("/dashboard/employee"), 2000);
        } else {
          toast.error(addResponse.data.Error);
        }
      } catch (err) {
        // toast.error("Error adding employee!");
        console.log(err);
      }
    };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
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
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
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
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) =>
                setEmployee({ ...employee, department_id: e.target.value })}
            >
              <option value="">Select Department</option>
              {category.map((c) => (
                <option key={c.department_id} value={c.department_id}>
                  {c.department_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="post" className="form-label">
              Post
            </label>
            <select
              id="post"
              className="form-select"
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
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) =>
                setEmployee({ ...employee, image: e.target.files[0] })
              }
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
