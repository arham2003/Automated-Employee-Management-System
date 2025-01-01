import React, { createContext, useContext, useState } from 'react';

// Create the EmployeeContext
const EmployeeContext = createContext();

// Create a provider component
export const EmployeeProvider = ({ children }) => {
  const [employeeId, setEmployeeId] = useState(localStorage.getItem('employeeId') || null);

  // Function to update employeeId
  const updateEmployeeId = (id) => {
    setEmployeeId(id);
    localStorage.setItem('employeeId', id); // Persisting to localStorage (optional)
  };

  return (
    <EmployeeContext.Provider value={{ employeeId, updateEmployeeId }}>
      {children}
    </EmployeeContext.Provider>
  );
};

// Create a custom hook for consuming the EmployeeContext
export const useEmployee = () => useContext(EmployeeContext);
