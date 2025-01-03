
import 'bootstrap/dist/css/bootstrap.min.css';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'react-hot-toast';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import SubmittedWork from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Start from './Components/Start';
import EmployeeLogin from './Components/EmployeeLogin';
import EmployeeDetail from './Components/EmployeeDetail';
import PrivateRoute from './Components/PrivateRoute';
import Projects from './Components/projects/project';
import ProjectForm from './Components/projects/ProjectForm';
import ProjectDetail from './Components/projects/ProjectDetail';
import ProjectPhaseForm from './Components/projects/ProjectPhaseForm';
import AttendanceForm from './Components/Attendance/AttendanceForm';
import AttendanceRecords from './Components/Attendance/AttendanceRecords';
import UpdateForm from './Components/Attendance/UpdateForm';
import Customer from './Components/Customer/Customer';
import Departments from './Components/Departments/Departments';
import { EmployeeProvider } from './Components/EmployeePanel/EmployeeContext';
import AssignedWork from './Components/EmployeePanel/AssignedWork';
import EmpAttendance from './Components/EmployeePanel/EmpAttendance';
import SalaryTracker from './Components/Salaries/Salaries';

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />}></Route>
          <Route path="/adminlogin" element={<Login />}></Route>
          <Route path="/employee_login" element={<EmployeeLogin />}></Route>

          {/* Employee Detail Route */}
          <Route path="/employee_detail/:id" element={<EmployeeDetail />} />

          {/* Link to Assigned Work */}
          <Route path="/employee_detail/:id/assigned_work" element={<AssignedWork />} />

          {/* Link to Attendance */}
          <Route path="/employee_detail/:employeeId/attendance" element={<EmpAttendance />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Toaster position="top-center" reverseOrder={false}/>
              <Dashboard />
            </PrivateRoute>
          }>
            
            <Route path="" element={<Home />}></Route>
            <Route path="/dashboard/employee" element={<Employee />}></Route>
            <Route path="/dashboard/customer" element={<Customer />}></Route>
            <Route path="/dashboard/departments" element={<Departments />}></Route>
            <Route path="/dashboard/attendance" element={<AttendanceRecords />}></Route>
            <Route path="/dashboard/take_attendance" element={<AttendanceForm />}></Route>
            <Route path="/dashboard/update_attendance" element={<UpdateForm />}></Route>
            <Route path="/dashboard/profile" element={<SubmittedWork />}></Route>
            <Route path="/dashboard/projects" element={<Projects />}></Route>
            <Route path="/dashboard/project_phase" element={<ProjectPhaseForm />}></Route>
            <Route path="/dashboard/projectForm" element={<ProjectForm />}></Route>
            <Route path="/dashboard/project/:id" element={<ProjectDetail />}></Route>
            <Route path="/dashboard/add_category" element={<AddCategory />}></Route>
            <Route path="/dashboard/add_employee" element={<AddEmployee />}></Route>
            <Route path="/dashboard/edit_employee/:id" element={<EditEmployee />}></Route>
            <Route path="/dashboard/salaries" element={<SalaryTracker />}></Route>
            
          </Route>
          
        </Routes>
        
      </BrowserRouter>
      
    </EmployeeProvider>
    
  );
}

export default App;
