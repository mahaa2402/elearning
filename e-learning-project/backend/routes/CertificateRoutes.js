const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { 
  checkCourseCompletionAndGenerateCertificate,
  getCourseCompletionStatus,
  getEmployeeCertificatesAPI
} = require('../controllers/CertificateController');

// Authentication middleware
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

// 🔥 MAIN: Check course completion and generate certificate
router.post('/check-course-completion', authenticateToken, checkCourseCompletionAndGenerateCertificate);

// Get course completion status
router.get('/course-status/:courseName', authenticateToken, getCourseCompletionStatus);

// Get all certificates for the authenticated user
router.get('/employee-certificates', authenticateToken, getEmployeeCertificatesAPI);

module.exports = router;