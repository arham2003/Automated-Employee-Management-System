import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddDepartment from './AddDepartmentForm';

const handleDeleteClick = (departmentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this department?');
    if (confirmDelete) {
        axios.delete(`http://localhost:3000/delete_department/${departmentId}`)
            .then(() => {
                setDepartments(departments.filter(department => department.department_id !== departmentId));
                alert('Department deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting department:', error);
                
                // Check for foreign key constraint error
                if (error.response && error.response.data && error.response.data.Error.includes('foreign key constraint')) {
                    alert('Cannot delete this department because it has associated employees. Please remove all employees first.');
                } else {
                    alert('An error occurred while deleting the department. Please try again.');
                }
            });
    }
};


const Departments = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [editDepartment, setEditDepartment] = useState(null); // For Edit functionality

    // Fetch departments data from the API
    useEffect(() => {
        axios.get('http://localhost:3000/get_all_departments')
            .then((response) => {
                setDepartments(response.data);
            })
            .catch((error) => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    // Fetch employees data for department head mapping
    useEffect(() => {
        axios.get('http://localhost:3000/get_all_employees')
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
            });
    }, []);

    

    // Toggle Add Department form visibility
    const handleAddClick = () => {
        setShowAddForm(!showAddForm);
    };

    // Function to get employee name by ID
    const getEmployeeNameById = (id) => {
        const employee = employees.find(emp => emp.id === id);
        return employee ? employee.name : 'Unknown';
    };

    // Handle Edit Button Click
    const handleEditClick = (departmentId) => {
        const department = departments.find(dep => dep.department_id === departmentId);
        setEditDepartment(department); // Open the edit modal or form with current data
    };

    // Handle Save Edit
    const handleSaveEdit = () => {
        // Call API to save edited department
        axios.put(`http://localhost:3000/update_department/${editDepartment.department_id}`, editDepartment)
            .then((response) => {
                // Update the department in the list
                setDepartments(departments.map(dep => dep.department_id === editDepartment.department_id ? editDepartment : dep));
                setEditDepartment(null);  // Close the edit form
    
                // Show success alert
                alert('Department updated successfully!');
            })
            .catch((error) => {
                console.error('Error saving department:', error);
                // Optionally show an error alert
                alert('Error updating department. Please try again.');
            });
    };

    // Handle Delete Button Click
    const handleDeleteClick = (departmentId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this department?');
        if (confirmDelete) {
            axios.delete(`http://localhost:3000/delete_department/${departmentId}`)
                .then(() => {
                    setDepartments(departments.filter(department => department.department_id !== departmentId));
                })
                .catch((error) => {
                    console.error('Error deleting department:', error);
                });
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Departments</h2>
                <button className="btn btn-primary" onClick={handleAddClick}>
                    {showAddForm ? 'Close' : 'Add Department'}
                </button>
            </div>

            {showAddForm && (
                <div className="mb-3">
                    <AddDepartment />
                </div>
            )}

            {/* Department Table */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Department Name</th>
                        <th>Department Head</th>
                        <th>Street</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Postal Code</th>
                        <th>Country</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length > 0 ? (
                        departments.map((department) => (
                            <tr key={department.department_id}>
                                <td>{department.department_name}</td>
                                <td>{getEmployeeNameById(department.department_head)}</td>
                                <td>{department.street}</td>
                                <td>{department.city}</td>
                                <td>{department.state}</td>
                                <td>{department.postal_code}</td>
                                <td>{department.country}</td>
                                <td>
                                    <button 
                                        className="btn btn-warning mr-2"
                                        onClick={() => handleEditClick(department.department_id)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteClick(department.department_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No departments available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Edit Department Form */}
            {editDepartment && (
                <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px', margin: '100px auto' }}>
                        <h3>Edit Department</h3>
                        <div className="mb-3">
                            <label>Department Name</label>
                            <input
                                type="text"
                                value={editDepartment.department_name || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, department_name: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label>Department Head</label>
                            <select
                                value={editDepartment.department_head || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, department_head: e.target.value })}
                                className="form-control"
                            >
                                <option value="">Select Head</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Street</label>
                            <input
                                type="text"
                                value={editDepartment.street || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, street: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label>City</label>
                            <input
                                type="text"
                                value={editDepartment.city || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, city: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label>State</label>
                            <input
                                type="text"
                                value={editDepartment.state || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, state: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                value={editDepartment.postal_code || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, postal_code: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label>Country</label>
                            <input
                                type="text"
                                value={editDepartment.country || ''}
                                onChange={(e) => setEditDepartment({ ...editDepartment, country: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <button onClick={handleSaveEdit} className="btn btn-success mr-2">
                            Save Changes
                        </button>
                        <button onClick={() => setEditDepartment(null)} className="btn btn-secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Departments;
