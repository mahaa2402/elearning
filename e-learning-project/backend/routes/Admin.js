// routes/Admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/Admin');
const {
   getEmployees,
   getEmployeesForAssignment,
   verifyToken,
   createAssignedTask,
   getAssignedTasks,
   getAssignedTaskById,
   updateAssignedTaskProgress,
   deleteAssignedTask,
   getAssignedTasksStats,
   createCourse,
   getCourses,
   getCourseById,
   updateCourse,
   deleteCourse,
   getAssignedCourses,
   getAvailableCourses,
   assignTaskByEmail,
   getAssignedTasksForUser,
   startAssignedTask
} = require('../controllers/Admin');
const { authenticateToken } = require('../middleware/auth'); // Assuming you have this middleware

// ============ AUTHENTICATION ROUTES ============
// Token Verification
router.get('/verify-token', authenticateToken, verifyToken);

// ============ EMPLOYEE ROUTES ============
// Employee Management Routes
router.get('/employees', authenticateToken, getEmployees);
router.get('/employees-for-assignment', authenticateToken, getEmployeesForAssignment);

// ============ ASSIGNED TASKS ROUTES ============
// Main assigned tasks routes
router.post('/assigned-tasks', authenticateToken, createAssignedTask);
router.get('/assigned-tasks', authenticateToken, getAssignedTasks);
router.get('/assigned-tasks/stats/dashboard', authenticateToken, getAssignedTasksStats);
router.get('/assigned-tasks/:id', authenticateToken, getAssignedTaskById);
router.put('/assigned-tasks/:id/progress', authenticateToken, updateAssignedTaskProgress);
router.delete('/assigned-tasks/:id', authenticateToken, deleteAssignedTask);

// Alternative assigned tasks routes (assignedtasks format)
router.get('/assignedtasks', authenticateToken, getAssignedTasks); // ADD THIS LINE - frontend is looking for this
router.post('/assignedtasks', authenticateToken, assignTaskByEmail);
router.get('/assignedtasks/user/:userId', authenticateToken, getAssignedTasksForUser);
router.patch('/assignedtasks/:taskId/start', authenticateToken, startAssignedTask);

// Additional task management routes
router.post('/assignedtasks/start/:taskId', authenticateToken, startAssignedTask); // Alternative route
router.post('/assign-task-email', authenticateToken, assignTaskByEmail); // Alternative route

// ============ COURSE ROUTES ============
// Course Management Routes
router.post('/courses', authenticateToken, createCourse);
router.get('/courses', authenticateToken, getCourses);
router.get('/courses/:id', authenticateToken, getCourseById);
router.put('/courses/:id', authenticateToken, updateCourse);
router.delete('/courses/:id', authenticateToken, deleteCourse);

// ============ ASSIGNED COURSES ROUTES ============
// Course Assignment Routes
router.get('/assigned-courses', authenticateToken, getAssignedCourses);
router.get('/available-courses', authenticateToken, getAvailableCourses);

// ============ ADDITIONAL UTILITY ROUTES ============
// Task Statistics
router.get('/tasks/stats', authenticateToken, getAssignedTasksStats);
router.get('/dashboard/stats', authenticateToken, getAssignedTasksStats);

// Employee Task Management
router.get('/employee/:userId/tasks', authenticateToken, getAssignedTasksForUser);
router.patch('/tasks/:taskId/start', authenticateToken, startAssignedTask);
router.put('/tasks/:id/progress', authenticateToken, updateAssignedTaskProgress);

module.exports = router;