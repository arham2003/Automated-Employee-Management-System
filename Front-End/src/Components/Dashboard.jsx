import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const sidebarRef = useRef(null); // Ref for the sidebar
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notifications`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Clear Notifications
  const clearNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete_notifications`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications([]); // Clear the notifications state
        console.log("Notifications cleared successfully!");
      } else {
        console.error("Error clearing notifications.");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleLogout = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`).then((result) => {
      if (result.data.Status) {
        localStorage.removeItem("valid");
        localStorage.removeItem('toastShown');
        navigate("/");
      }
    });
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (isSidebarVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarVisible]);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Left Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark bg-gradient">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Gray Coders
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="/dashboard"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-houses ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/employee"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-people ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Employees</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/customer"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-workspace ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Customers</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/departments"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-building ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Departments</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/projects"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-file-earmark ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Projects</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/attendance"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-calendar-check ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/salaries"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-wallet ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Salaries</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/dashboard/profile"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-person-circle ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>
              <li className="w-100" onClick={handleLogout}>
                <Link className="nav-link text-white px-0 align-middle">
                  <i className="bi bi-power ms-2 fs-4"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0 m-0 position-relative">
          <div className="p-1 d-flex justify-content-center shadow text-bg-secondary bg-gradient align-items-center">
            <h4 className="text-center flex-grow-1">
              <i className="bi bi-building-gear"> </i>
              Employee Management System
            </h4>
            <div>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={() => setSidebarVisible(!isSidebarVisible)}
              >
                <i
                  className={`bi ${
                    isSidebarVisible ? "bi-x-lg" : "bi-bell"
                  } fs-5`}
                ></i>
              </button>
            </div>
          </div>

          <Outlet />

          {/* Right Sidebar */}
          <div
            className={`notifications-card ${isSidebarVisible ? "show" : ""}`}
            ref={sidebarRef} // Attach ref to sidebar
          >
            <div className="d-flex justify-content-between align-items-center p-2">
              <h5>Notifications</h5>
              <div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={clearNotifications}
                >
                  Clear All
                </button>
              </div>
            </div>
            <ul className="list-unstyled">
              {notifications.length === 0 ? (
                <p>No notifications available.</p>
              ) : (
                notifications.map((note) => (
                  <li key={note.id}>{note.message}</li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
