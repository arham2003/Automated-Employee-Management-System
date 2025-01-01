import React from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const valid = localStorage.getItem("valid");
  return valid === "true"; // Explicitly check for a specific value
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
