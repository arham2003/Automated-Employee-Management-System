import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentHead, setDepartmentHead] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    // Fetch employee data for the dropdown
    useEffect(() => {
        axios.get('http://localhost:3000/get_all_employees')
            .then(response => {
                setEmployees(response.data); // Store the employee data
            })
            .catch(err => {
                toast.error("Failed to fetch employees. Please try again.");
                console.error("Failed to fetch employees:", err);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const department = {
            department_name: departmentName,
            department_head: departmentHead,
            street,
            city,
            state,
            postal_code: postalCode,
            country,
        };

        axios.post('http://localhost:3000/add_department', department)
            .then(result => {
                if (result.data.Status) {
                    toast.success("Department added successfully!");
                    setDepartmentName('');
                    setDepartmentHead('');
                    setStreet('');
                    setCity('');
                    setState('');
                    setPostalCode('');
                    setCountry('');
                    navigate('/dashboard/departments');
                } else {
                    toast.error(result.data.Error);
                }
            })
            .catch(err => {
                toast.error("Department already exists. Please use a different name.");
                console.error("Error adding department:", err);
            });
    };

    return (
        <div className='d-flex justify-content-center align-items-center h-75'>
            <div className='p-3 rounded w-50 border'>
                <h2>Add Department</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="departmentName"><strong>Department Name:</strong></label>
                        <input 
                            type="text" 
                            name='departmentName' 
                            placeholder='Enter Department Name'
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)} 
                            className='form-control rounded-0' 
                            required 
                        />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="departmentHead"><strong>Department Head:</strong></label>
                        <select 
                            name="departmentHead"
                            value={departmentHead}
                            onChange={(e) => setDepartmentHead(e.target.value)} 
                            className="form-control rounded-0" 
                            required
                        >
                            <option value="">Select Department Head</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name} {/* Display name but send ID */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="street"><strong>Street:</strong></label>
                        <input 
                            type="text" 
                            name='street' 
                            placeholder='Enter Street'
                            value={street}
                            onChange={(e) => setStreet(e.target.value)} 
                            className='form-control rounded-0' 
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="city"><strong>City:</strong></label>
                        <input 
                            type="text" 
                            name='city' 
                            placeholder='Enter City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)} 
                            className='form-control rounded-0' 
                            required 
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="state"><strong>State/Province:</strong></label>
                        <input 
                            type="text" 
                            name='state' 
                            placeholder='Enter State/Province'
                            value={state}
                            onChange={(e) => setState(e.target.value)} 
                            className='form-control rounded-0' 
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="postalCode"><strong>Postal Code:</strong></label>
                        <input 
                            type="text" 
                            name='postalCode' 
                            placeholder='Enter Postal Code'
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)} 
                            className='form-control rounded-0' 
                        />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="country"><strong>Country:</strong></label>
                        <input 
                            type="text" 
                            name='country' 
                            placeholder='Enter Country'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)} 
                            className='form-control rounded-0' 
                            required 
                        />
                    </div>
                    <button className='btn btn-success w-100 rounded-0 mb-2'>Add Department</button>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;
