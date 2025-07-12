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
import CourseModules from '../pages/coursemodule';
import Lesson2 from '../pages/lesson2page';
import Lesson3 from '../pages/lesson3page';
import Lesson4 from '../pages/lesson4page';
import Quiz from '../pages/quiz';
import QuizLesson2 from '../pages/quiz2';
import QuizLesson3 from '../pages/quiz3';
import QuizLesson4 from '../pages/quiz4';
import TaskDetailPage from '../pages/taskdetailpage';



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
         
         <Route path="/coursemodules" element={<CourseModules />} />
        <Route path="/lesson2" element={<Lesson2 />} />
        <Route path="/lesson3" element={<Lesson3 />} />
        <Route path="/lesson4" element={<Lesson4 />} /> 
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz2" element={<QuizLesson2 />} />
        <Route path="/quiz3" element={<QuizLesson3 />} />
        <Route path="/quiz4" element={<QuizLesson4 />} />
        <Route path="/taskdetailpage" element={<TaskDetailPage />} />
        
        {/* Add more routes as needed */}
          


        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
