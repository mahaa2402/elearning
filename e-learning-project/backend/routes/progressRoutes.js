const express = require('express');
const router = express.Router();
const EmployeeProgress = require('../models/EmployeeProgress');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/progress/submit-quiz - Submit quiz results
router.post('/submit-quiz', authenticateToken, async (req, res) => {
  try {
    console.log('==> /submit-quiz called');
    const { quizId, quizName, score, totalQuestions, passed } = req.body;
    const employeeEmail = req.user.email;
    console.log('Payload:', req.body);
    console.log('User:', req.user);

    if (!quizId || !quizName || score === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: quizId, quizName, score, totalQuestions'
      });
    }

    // Find or create employee progress record
    let employeeProgress = await EmployeeProgress.findOne({ employeeEmail });
    console.log('Found EmployeeProgress:', employeeProgress);

    if (!employeeProgress) {
      // Create new progress record
      const employee = await Employee.findOne({ email: employeeEmail });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      employeeProgress = new EmployeeProgress({
        employeeId: employee._id,
        employeeEmail: employeeEmail
      });
      console.log('Created new EmployeeProgress');
    }

    // Update quiz progress
    employeeProgress.updateQuizProgress(quizId, quizName, score, totalQuestions, passed);
    await employeeProgress.save();
    console.log('Saved EmployeeProgress:', employeeProgress);

    // Also update the Employee model's levelCount for backward compatibility
    if (passed) {
      await Employee.findOneAndUpdate(
        { email: employeeEmail },
        { levelCount: employeeProgress.currentLevel },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Quiz progress updated successfully',
      data: {
        currentLevel: employeeProgress.currentLevel,
        totalQuizzesCompleted: employeeProgress.totalQuizzesCompleted,
        averageScore: employeeProgress.averageScore,
        quizProgress: employeeProgress.quizProgress
      }
    });

  } catch (error) {
    console.error('Error submitting quiz progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz progress',
      error: error.message
    });
  }
});

// GET /api/progress/:email - Get employee progress
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    let employeeProgress = await EmployeeProgress.findOne({ employeeEmail: email });
    
    if (!employeeProgress) {
      // Return default progress if no record exists
      return res.status(200).json({
        success: true,
        data: {
          currentLevel: 0,
          totalQuizzesCompleted: 0,
          averageScore: 0,
          quizProgress: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentLevel: employeeProgress.currentLevel,
        totalQuizzesCompleted: employeeProgress.totalQuizzesCompleted,
        averageScore: employeeProgress.averageScore,
        quizProgress: employeeProgress.quizProgress
      }
    });

  } catch (error) {
    console.error('Error fetching employee progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee progress',
      error: error.message
    });
  }
});

// GET /api/progress/stats/:email - Get detailed progress statistics
router.get('/stats/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const employeeProgress = await EmployeeProgress.findOne({ employeeEmail: email });
    
    if (!employeeProgress) {
      return res.status(200).json({
        success: true,
        data: {
          currentLevel: 0,
          totalQuizzesCompleted: 0,
          averageScore: 0,
          totalScore: 0,
          lastActivity: null,
          quizProgress: []
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentLevel: employeeProgress.currentLevel,
        totalQuizzesCompleted: employeeProgress.totalQuizzesCompleted,
        averageScore: employeeProgress.averageScore,
        totalScore: employeeProgress.totalScore,
        lastActivity: employeeProgress.lastActivity,
        quizProgress: employeeProgress.quizProgress
      }
    });

  } catch (error) {
    console.error('Error fetching employee progress stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee progress statistics',
      error: error.message
    });
  }
});

module.exports = router; 