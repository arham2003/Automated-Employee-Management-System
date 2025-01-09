import React, { useState, useEffect } from 'react';
import CustomerDetailForm from './CustomerDetailsForm';
import './Customer.css';

function Customer() {
  const [showForm, setShowForm] = useState(false); // Controls showing the form
  const [customers, setCustomers] = useState([]);  // Stores the list of customers
  const [currentCustomer, setCurrentCustomer] = useState(null); // Stores the current customer being edited

  // Fetch customers data from the API when the component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get_allCustomers`);
        const data = await response.json();
        
        if (Array.isArray(data.Result)) {
          setCustomers(data.Result);  // Set the customers state with the fetched data inside "Result"
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  const handleEdit = (customer) => {
    setCurrentCustomer(customer); // Set the customer to be edited
    setShowForm(true); // Show the form for editing
  };

  const handleDelete = async (customerId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete_customer/${customerId}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
  
      if (result.Status) {
        // If deletion is successful, remove the customer from the list
        setCustomers(customers.filter((customer) => customer.customer_id !== customerId));
        alert('Customer deleted successfully!');
      } else {
        alert('Failed to delete customer: ' + result.Message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('An error occurred while deleting the customer.');
    }
  };

const handleFormSubmit = (newCustomer) => {
  if (currentCustomer) {
    // If editing, replace the customer in the list with the updated data
    setCustomers(customers.map(cust => 
      cust.customer_id === newCustomer.customer_id ? newCustomer : cust
    ));
  } else {
    // If adding new, append the new customer to the list
    // Ensure the newCustomer has an id (which should come from the server after adding)
    if (newCustomer.customer_id) {
      setCustomers([...customers, newCustomer]);
    } else {
      console.error("New customer object is missing 'customer_id'.");
    }
  }

  setShowForm(false); // Hide form after submission
};

  return (
    <div className="container mt-4">
      {/* Button to toggle the form */}
      <button 
        className="btn btn-primary mb-3" 
        onClick={() => {
          setShowForm(!showForm);
          setCurrentCustomer(null); // Reset current customer when adding new one
        }}
      >
        {showForm ? 'Hide Form' : 'Add Customer'}
      </button>

      {/* Show form when button is clicked */}
      {showForm && (
        <CustomerDetailForm 
          onFormSubmit={handleFormSubmit} // Pass form submission handler
          customer={currentCustomer} // Pass the current customer to edit
        />
      )}

      {/* Display customer table */}
      <h2>Customer Details</h2>
      <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', overflowX: 'auto' }}>
        <table className="table table-striped table-bordered" style={{ width: '100%', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Company</th>
              <th>Street Address</th>
              <th>City</th>
              <th>State</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="11">No customers available.</td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer.customer_id}>
                  <td>{index + 1}</td>
                  <td>{customer.full_name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                  <td>{customer.company_name || 'No Company'}</td>
                  <td>{customer.street_address}</td>
                  <td>{customer.city}</td>
                  <td>{customer.state}</td>
                  <td>{customer.postal_code}</td>
                  <td>{customer.country}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer.customer_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customer;
