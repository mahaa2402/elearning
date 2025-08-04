const mongoose = require('mongoose');
const UserProgress = require('../models/Userprogress');
const CommonCourse = require('../models/common_courses');


// Certificate Schema - defined in the controller file as requested
const certificateSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeeId: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseId: { type: String },
  completedModules: [{ type: String }],
  totalModules: { type: Number, required: true },
  completionDate: { type: Date, default: Date.now },
  certificateId: { type: String, unique: true },
  date: { type: String, required: true },
  module: { type: String, default: 'Information Security & Data Protection' }
}, {
  timestamps: true
});

// Generate unique certificate ID
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    this.certificateId = `CERT-${this.courseTitle.substring(0, 3).toUpperCase()}-${timestamp}-${randomStr}`;
  }
  next();
});

const Certificate = mongoose.model('Certificate', certificateSchema);

/**
 * Check if all modules in a course are completed
 */
const checkCourseCompletion = async (employeeEmail, courseName) => {
  try {
    console.log(`🔍 Checking if course "${courseName}" is completed for ${employeeEmail}`);
    
    // Get the course details to know total modules
    let course = await CommonCourse.findOne({ title: courseName });
    
    // If not found, try alternative course names
    if (!course) {
      if (courseName === 'Factory Act') {
        course = await CommonCourse.findOne({ title: 'Factory Act' });
      } else if (courseName === 'Welding') {
        course = await CommonCourse.findOne({ title: 'Welding' });
      } else if (courseName === 'CNC') {
        course = await CommonCourse.findOne({ title: 'CNC' });
      }
    }
    
    if (!course) {
      // Debug: List all available courses
      const allCourses = await CommonCourse.find({}, 'title');
      console.log(`⚠️ Course "${courseName}" not found in common courses`);
      console.log(`📋 Available courses:`, allCourses.map(c => c.title));
      return {
        isCompleted: false,
        error: 'Course not found'
      };
    }
    
    const totalModules = course.modules.length;
    console.log(`📊 Total modules in ${courseName}: ${totalModules}`);
    
    // Get user progress for this course
    const userProgress = await UserProgress.findOne({ userEmail: employeeEmail, courseName });
    if (!userProgress) {
      console.log(`📊 No progress found for ${employeeEmail} in ${courseName}`);
      return {
        isCompleted: false,
        completedModules: [],
        totalModules,
        completedCount: 0,
        courseModules: course.modules
      };
    }
    
    const completedModulesCount = userProgress.completedModules.length;
    console.log(`📊 Completed modules: ${completedModulesCount}/${totalModules}`);
    
    const isCompleted = completedModulesCount >= totalModules;
    console.log(`✅ Course completion status: ${isCompleted ? 'COMPLETED' : 'IN PROGRESS'}`);
    
    return {
      isCompleted,
      completedModules: userProgress.completedModules,
      totalModules,
      completedCount: completedModulesCount,
      courseModules: course.modules,
      lastAccessedModule: userProgress.lastAccessedModule
    };
    
  } catch (error) {
    console.error('❌ Error checking course completion:', error);
    return {
      isCompleted: false,
      error: error.message
    };
  }
};

/**
 * Generate certificate for completed course
 */
const generateCertificate = async (employeeEmail, courseName, employeeName, employeeId) => {
  try {
    console.log(`🎓 Generating certificate for ${employeeEmail} - ${courseName}`);
    
    // Check if course is completed
    const completionStatus = await checkCourseCompletion(employeeEmail, courseName);
    
    if (!completionStatus.isCompleted) {
      return {
        success: false,
        message: 'Course is not completed yet',
        completionStatus
      };
    }
    
    // Check if certificate already exists
    const existingCertificate = await Certificate.findOne({
      employeeEmail: employeeEmail,
      courseTitle: courseName
    });
    
    if (existingCertificate) {
      return {
        success: true,
        message: 'Certificate already exists for this course',
        certificate: existingCertificate,
        isNew: false
      };
    }
    
    // Generate new certificate
    const newCertificate = new Certificate({
      employeeName: employeeName || employeeEmail.split('@')[0],
      employeeId: employeeId || employeeEmail,
      employeeEmail: employeeEmail,
      courseTitle: courseName,
      courseId: courseName,
      completedModules: completionStatus.completedModules.map(mod => mod.m_id),
      totalModules: completionStatus.totalModules,
      completionDate: new Date(),
      date: new Date().toLocaleDateString()
    });
    
    await newCertificate.save();
    
    console.log(`✅ Certificate generated successfully: ${newCertificate.certificateId}`);
    
    return {
      success: true,
      message: 'Certificate generated successfully',
      certificate: newCertificate,
      isNew: true
    };
    
  } catch (error) {
    console.error('❌ Error generating certificate:', error);
    return {
      success: false,
      message: 'Failed to generate certificate',
      error: error.message
    };
  }
};

/**
 * Get certificate by employee email and course
 */
const getCertificate = async (employeeEmail, courseName) => {
  try {
    const certificate = await Certificate.findOne({
      employeeEmail: employeeEmail,
      courseTitle: courseName
    });
    
    if (!certificate) {
      return {
        success: false,
        message: 'Certificate not found'
      };
    }
    
    return {
      success: true,
      certificate: certificate
    };
    
  } catch (error) {
    console.error('❌ Error fetching certificate:', error);
    return {
      success: false,
      message: 'Failed to fetch certificate',
      error: error.message
    };
  }
};

/**
 * Get all certificates for an employee
 */
const getEmployeeCertificates = async (employeeEmail) => {
  try {
    const certificates = await Certificate.find({ employeeEmail }).sort({ completionDate: -1 });
    
    return {
      success: true,
      certificates: certificates,
      count: certificates.length
    };
    
  } catch (error) {
    console.error('❌ Error fetching employee certificates:', error);
    return {
      success: false,
      message: 'Failed to fetch certificates',
      error: error.message
    };
  }
};

/**
 * Main API endpoint to check course completion and generate certificate
 */
const checkCourseCompletionAndGenerateCertificate = async (req, res) => {
  try {
    const { courseName, courseId } = req.body;
    const employeeEmail = req.user.email;
    const employeeId = req.user.id || req.user._id;
    const employeeName = req.user.name || employeeEmail.split('@')[0];

    console.log(`🔍 Checking course completion for ${employeeEmail} - ${courseName}`);

    if (!courseName) {
      return res.status(400).json({ 
        success: false,
        message: 'Course name is required' 
      });
    }

    // Check course completion status
    const completionStatus = await checkCourseCompletion(employeeEmail, courseName);
    
    if (completionStatus.error) {
      return res.status(404).json({
        success: false,
        message: completionStatus.error
      });
    }

    console.log(`📊 Course completion status:`, completionStatus);

    if (completionStatus.isCompleted) {
      // Generate certificate
      const certificateResult = await generateCertificate(employeeEmail, courseName, employeeName, employeeId);
      
      if (certificateResult.success) {
        return res.status(200).json({
          success: true,
          isCompleted: true,
          certificateExists: !certificateResult.isNew,
          certificate: certificateResult.certificate,
          message: certificateResult.message,
          completionStatus
        });
      } else {
        return res.status(500).json({
          success: false,
          message: certificateResult.message
        });
      }
    } else {
      return res.status(200).json({
        success: true,
        isCompleted: false,
        progress: {
          completed: completionStatus.completedCount,
          total: completionStatus.totalModules,
          percentage: Math.round((completionStatus.completedCount / completionStatus.totalModules) * 100)
        },
        message: `Course in progress: ${completionStatus.completedCount}/${completionStatus.totalModules} modules completed`,
        completionStatus
      });
    }

  } catch (error) {
    console.error('❌ Error in course completion check:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

/**
 * Get course completion status
 */
const getCourseCompletionStatus = async (req, res) => {
  try {
    const { courseName } = req.params;
    const employeeEmail = req.user.email;

    console.log(`🔍 Getting course completion status for ${employeeEmail} - ${courseName}`);

    const status = await checkCourseCompletion(employeeEmail, courseName);

    if (status.error) {
      return res.status(404).json({
        success: false,
        message: status.error
      });
    }

    res.status(200).json({
      success: true,
      courseName,
      status
    });

  } catch (error) {
    console.error('❌ Error getting course status:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

/**
 * Get employee certificates
 */
const getEmployeeCertificatesAPI = async (req, res) => {
  try {
    const employeeEmail = req.user.email;

    const result = await getEmployeeCertificates(employeeEmail);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('❌ Error fetching employee certificates:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

module.exports = {
  checkCourseCompletion,
  generateCertificate,
  getCertificate,
  getEmployeeCertificates,
  checkCourseCompletionAndGenerateCertificate,
  getCourseCompletionStatus,
  getEmployeeCertificatesAPI,
  Certificate
}; 