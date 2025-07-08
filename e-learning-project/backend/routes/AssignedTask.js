const express = require('express');
const router = express.Router();
const { createAssignedTask, getAssignedTasks, getAssignedTaskById, updateAssignedTaskProgress, deleteAssignedTask } = require('../controllers/Admin');
const { authenticateToken } = require('../middleware/auth');

// POST /api/assigned-tasks - Assign a new task (admin only)
router.post('/assigned-tasks', authenticateToken, createAssignedTask);

// GET /api/assigned-tasks - Get all assigned tasks (admin/employee)
router.get('/assigned-tasks', authenticateToken, getAssignedTasks);

// GET /api/assigned-tasks/:id - Get assigned task by ID
router.get('/assigned-tasks/:id', authenticateToken, getAssignedTaskById);

// PATCH /api/assigned-tasks/:id/progress - Update task progress (employee)
router.patch('/assigned-tasks/:id/progress', authenticateToken, updateAssignedTaskProgress);

// DELETE /api/assigned-tasks/:id - Delete assigned task (admin only)
router.delete('/assigned-tasks/:id', authenticateToken, deleteAssignedTask);

module.exports = router;
