const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');
const jwt = require('jsonwebtoken');

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

router.post('/save-certificate', authenticateToken, async (req, res) => {
  try {
    const { courseTitle, date, employeeName: bodyEmployeeName, employeeId: bodyEmployeeId } = req.body;
    const employeeEmail = req.user.email;
    // Prefer body values if provided, else fallback to token
    const employeeId = bodyEmployeeId || req.user.id || req.user._id;
    let employeeName = bodyEmployeeName || req.user.name;
    if (!employeeName) {
      employeeName = employeeEmail.split('@')[0];
    }

    // Validate required fields
    if (!courseTitle || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['courseTitle', 'date'] 
      });
    }

    // Check if certificate already exists for this employee and course
    const existingCertificate = await Certificate.findOne({
      employeeId: employeeId,
      courseTitle: courseTitle
    });

    if (existingCertificate) {
      return res.status(200).json({ 
        message: 'Certificate already exists for this employee and course',
        certificate: existingCertificate
      });
    }

    // Create new certificate
    const newCertificate = new Certificate({
      employeeName,
      employeeId,
      courseTitle,
      date,
      employeeEmail
    });

    await newCertificate.save();

    console.log('Certificate saved successfully:', {
      employeeName,
      employeeId,
      courseTitle,
      date
    });

    res.status(201).json({ 
      message: 'Certificate saved successfully',
      certificate: newCertificate
    });
  } catch (error) {
    console.error('Error saving certificate:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// Get certificates for the authenticated user
router.get('/certificates', authenticateToken, async (req, res) => {
  try {
    const employeeId = req.user.id || req.user._id;
    const certificates = await Certificate.find({ employeeId }).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      certificates: certificates
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

// 🔥 NEW: Main route for certificate details (matches your frontend navigation)
router.get('/certificatedetail/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log('Fetching certificate details for employeeId:', employeeId);
    
    const certificates = await Certificate.find({ employeeId }).sort({ date: -1 });
    
    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ 
        message: 'Certificate not found for this employee.' 
      });
    }
    
    // Get employee info from the first certificate
    const employeeInfo = {
      _id: employeeId,
      name: certificates[0].employeeName,
      email: certificates[0].employeeEmail
    };
    
    res.status(200).json({
      success: true,
      employee: employeeInfo,
      certificates: certificates
    });
  } catch (error) {
    console.error('Error fetching certificate details:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// 🔥 NEW: Alternative endpoint for getting certificates by employee ID
router.get('/certificates/employee/:employeeId', authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    console.log('Fetching certificates for employee:', employeeId);
    
    const certificates = await Certificate.find({ employeeId }).sort({ date: -1 });
    
    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ 
        message: 'No certificates found for this employee.' 
      });
    }
    
    res.status(200).json({
      success: true,
      certificates: certificates,
      count: certificates.length
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/certificate/:employeeId - fetch certificate(s) by employeeId
router.get('/certificate/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const certificates = await Certificate.find({ employeeId });
    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ error: 'No certificate found for this employee' });
    }
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificate', message: err.message });
  }
});

// GET /api/certificate/by-email/:employeeEmail - fetch certificate(s) by employeeEmail
router.get('/certificate/by-email/:employeeEmail', async (req, res) => {
  try {
    const { employeeEmail } = req.params;
    const certificates = await Certificate.find({ employeeEmail });
    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ error: 'No certificate found for this email' });
    }
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificate', message: err.message });
  }
});

// 🔥 UPDATED: Fixed this route to return all certificates for employee
router.get('/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    // Find ALL certificates for this employee, not just one
    const certificates = await Certificate.find({ employeeId });

    if (!certificates || certificates.length === 0) {
      return res.status(404).json({ message: 'Certificate not found for this employee.' });
    }

    // Return all certificates instead of just one
    res.json({
      success: true,
      certificates: certificates,
      count: certificates.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get a certificate by MongoDB _id (used in frontend)
router.get('/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found with this ID' });
    }

    res.status(200).json(certificate);
  } catch (error) {
    console.error('Error fetching certificate by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 🔥 NEW: Debug route to check all certificates (remove in production)
router.get('/debug/all-certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find().limit(10);
    res.json({
      total: await Certificate.countDocuments(),
      sample: certificates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;