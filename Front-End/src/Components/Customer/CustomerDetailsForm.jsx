import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CustomerDetailForm({ customer, onFormSubmit }) {
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error

  useEffect(() => {

    console.log(customer)
    if (customer) {
      // If editing, populate the form with customer data
      setFormValues({
        fullName: customer.full_name || '',
        email: customer.email || '',
        phoneNumber: customer.phone_number || '',
        companyName: customer.company_name || '',
        street: customer.street_address || '',
        city: customer.city || '',
        state: customer.state || '',
        postalCode: customer.postal_code || '',
        country: customer.country || ''
      });
    } else {
      // If adding a new customer, reset form
      setFormValues({
        fullName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const customerData = {
      full_name: formValues.fullName,
      email: formValues.email,
      phone_number: formValues.phoneNumber,
      company_name: formValues.companyName,
      street_address: formValues.street,
      city: formValues.city,
      state: formValues.state,
      postal_code: formValues.postalCode,
      country: formValues.country
    };

    try {
      let response;
      if (customer) {
        // Editing existing customer
        response = await axios.put(`http://localhost:3000/edit_customer/${customer.customer_id}`, customerData);
      } else {
        // Adding new customer
        response = await axios.post('http://localhost:3000/add_customer', customerData);
      }

      if (response.data.Status) {
        setMessage('Customer saved successfully!');
        setMessageType('success');
        onFormSubmit(response.data.Result || customerData);
      } else {
        setMessage('Failed to save customer. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error: Unable to connect to the server.');
      setMessageType('error');
    }

    // Reset the form
    setFormValues({
      fullName: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    });
  };

  return (
    <div>
      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border p-4 mb-4">
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formValues.fullName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formValues.phoneNumber}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Company Name */}
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formValues.companyName}
            onChange={handleChange}
            className="form-control"
            placeholder='Type "Individual" If Not Company'
            required
          />
        </div>

        {/* Street */}
        <div className="form-group">
          <label>Street</label>
          <input
            type="text"
            name="street"
            value={formValues.street}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formValues.city}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* State */}
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formValues.state}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Postal Code */}
        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formValues.postalCode}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formValues.country}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          {customer ? 'Update Customer' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default CustomerDetailForm;
