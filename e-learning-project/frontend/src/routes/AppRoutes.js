import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Auth pages
import Login from '../pages/login';
import Register from '../pages/register';

// Public page
import LandingPage from '../pages/landingpage';
import AdminDashboard from '../pages/admindashboard';
import AdminCourses from '../pages/admincourses';
import Sidebar from '../pages/sidebar';
import AssignTask from '../pages/assigntask';
import EmployeeTracking from '../pages/employeetracking';
import UserDashboard from '../pages/userdashboard';
import ContentPage from '../pages/contentpage';
import CourseDetailPage from '../pages/coursedetailpage';
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admincourses" element={<AdminCourses />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/assigntask" element={<AssignTask />} />
        <Route path="/employeetracking" element={<EmployeeTracking />} />
         <Route path="/userdashboard" element={<UserDashboard />} />
         <Route path="/contentpage" element={<ContentPage />} />
         <Route path="/coursedetailpage" element={<CourseDetailPage />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
