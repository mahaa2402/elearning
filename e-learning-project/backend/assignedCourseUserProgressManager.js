const mongoose = require('mongoose');
const AssignedCourseUserProgress = require('./models/AssignedCourseUserProgress');
const Employee = require('./models/Employee');
const Admin = require('./models/Admin');
require('dotenv').config();

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Initialize assigned course user progress for an employee
 * Creates a document with assigned courses initialized to 0
 */
async function initializeAssignedCourseProgress(employeeEmail) {
  try {
    // Check if progress already exists
    const existing = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (existing) {
      return existing;
    }

    // Get employee details
    const employee = await Employee.findOne({ email: employeeEmail });
    if (!employee) {
      throw new Error(`Employee not found: ${employeeEmail}`);
    }

    // Create new progress document with empty assigned course progress
    const newProgress = new AssignedCourseUserProgress({
      employeeId: employee._id,
      employeeName: employee.name,
      employeeEmail: employee.email,
      employeeDepartment: employee.department,
      assignedCourseProgress: new Map(),
      courseAssignments: []
    });

    await newProgress.save();
    console.log(`✅ Initialized assigned course progress for: ${employee.name} (${employeeEmail})`);
    return newProgress;

  } catch (error) {
    console.error('❌ Error initializing assigned course progress:', error);
    throw error;
  }
}

/**
 * Assign a course to an employee and initialize progress
 */
async function assignCourseToEmployee(employeeEmail, courseName, adminId, deadline = null) {
  try {
    console.log('🔍 DEBUG: assignCourseToEmployee called with:', { employeeEmail, courseName, adminId, deadline });
    
    // Get employee details
    const employee = await Employee.findOne({ email: employeeEmail });
    if (!employee) {
      throw new Error(`Employee not found: ${employeeEmail}`);
    }
    console.log('✅ Employee found:', employee.name);

    // Get admin details
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error(`Admin not found: ${adminId}`);
    }
    console.log('✅ Admin found:', admin.name);

    // Find or create progress document
    let progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    console.log('🔍 Existing progress found:', progress ? 'Yes' : 'No');
    
    if (!progress) {
      console.log('📝 Creating new progress document for:', employeeEmail);
      progress = new AssignedCourseUserProgress({
        employeeId: employee._id,
        employeeName: employee.name,
        employeeEmail: employee.email,
        employeeDepartment: employee.department,
        assignedCourseProgress: new Map(),
        courseAssignments: []
      });
    }

    // Check if course is already assigned
    const existingAssignment = progress.courseAssignments.find(
      assignment => assignment.courseName === courseName
    );

    if (existingAssignment) {
      console.log(`⚠️ Course "${courseName}" already assigned to ${employeeEmail}`);
      return progress;
    }

    console.log('📝 Adding new course assignment:', courseName);

    // Add course assignment
    progress.courseAssignments.push({
      courseName: courseName,
      assignedBy: {
        adminId: admin._id,
        adminName: admin.name,
        adminEmail: admin.email
      },
      assignedAt: new Date(),
      deadline: deadline,
      status: 'assigned'
    });

    // Initialize course progress to 0
    progress.assignedCourseProgress.set(courseName, 0);

    console.log('💾 Saving progress document...');
    await progress.save();
    console.log(`✅ Assigned course "${courseName}" to ${employee.name} (${employeeEmail})`);
    console.log('📊 Final progress document:', JSON.stringify(progress, null, 2));
    return progress;

  } catch (error) {
    console.error('❌ Error assigning course to employee:', error);
    throw error;
  }
}

/**
 * Update assigned course progress when a module is completed
 */
async function updateAssignedCourseProgress(employeeEmail, courseName) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (!progress) {
      throw new Error(`No progress found for employee: ${employeeEmail}`);
    }

    // Check if course is assigned to this employee
    const courseAssignment = progress.courseAssignments.find(
      assignment => assignment.courseName === courseName
    );

    if (!courseAssignment) {
      console.log(`⚠️ Course "${courseName}" is not assigned to ${employeeEmail}`);
      return null;
    }

    // Increment progress by 1
    const currentProgress = progress.assignedCourseProgress.get(courseName) || 0;
    progress.assignedCourseProgress.set(courseName, currentProgress + 1);

    // Update assignment status based on progress
    if (currentProgress + 1 > 0) {
      courseAssignment.status = 'in-progress';
    }

    await progress.save();
    console.log(`✅ Updated assigned course progress for ${employeeEmail} - ${courseName}: ${currentProgress + 1}`);
    return progress;

  } catch (error) {
    console.error('❌ Error updating assigned course progress:', error);
    throw error;
  }
}

/**
 * Get employee's assigned course progress
 */
async function getEmployeeAssignedCourseProgress(employeeEmail) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    return progress;
  } catch (error) {
    console.error('❌ Error getting employee assigned course progress:', error);
    throw error;
  }
}

/**
 * Get all employees' assigned course progress (for admin dashboard)
 */
async function getAllEmployeesAssignedCourseProgress() {
  try {
    const allProgress = await AssignedCourseUserProgress.find({})
      .populate('employeeId', 'name email department')
      .sort({ updatedAt: -1 });
    return allProgress;
  } catch (error) {
    console.error('❌ Error getting all employees assigned course progress:', error);
    throw error;
  }
}

/**
 * Get assigned courses for a specific employee
 */
async function getEmployeeAssignedCourses(employeeEmail) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (!progress) {
      return [];
    }
    return progress.courseAssignments;
  } catch (error) {
    console.error('❌ Error getting employee assigned courses:', error);
    throw error;
  }
}

/**
 * Mark assigned course as completed
 */
async function markAssignedCourseCompleted(employeeEmail, courseName) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (!progress) {
      throw new Error(`No progress found for employee: ${employeeEmail}`);
    }

    const courseAssignment = progress.courseAssignments.find(
      assignment => assignment.courseName === courseName
    );

    if (!courseAssignment) {
      throw new Error(`Course "${courseName}" is not assigned to ${employeeEmail}`);
    }

    courseAssignment.status = 'completed';
    await progress.save();

    console.log(`✅ Marked course "${courseName}" as completed for ${employeeEmail}`);
    return progress;

  } catch (error) {
    console.error('❌ Error marking assigned course as completed:', error);
    throw error;
  }
}

/**
 * Remove assigned course from employee
 */
async function removeAssignedCourse(employeeEmail, courseName) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (!progress) {
      throw new Error(`No progress found for employee: ${employeeEmail}`);
    }

    // Remove from course assignments
    progress.courseAssignments = progress.courseAssignments.filter(
      assignment => assignment.courseName !== courseName
    );

    // Remove from progress tracking
    progress.assignedCourseProgress.delete(courseName);

    await progress.save();
    console.log(`✅ Removed course "${courseName}" from ${employeeEmail}`);
    return progress;

  } catch (error) {
    console.error('❌ Error removing assigned course:', error);
    throw error;
  }
}

/**
 * Get assigned course statistics for admin dashboard
 */
async function getAssignedCourseStatistics() {
  try {
    const allProgress = await AssignedCourseUserProgress.find({});
    
    const stats = {
      totalEmployees: allProgress.length,
      totalAssignments: 0,
      completedAssignments: 0,
      inProgressAssignments: 0,
      overdueAssignments: 0,
      courseStats: {}
    };

    allProgress.forEach(progress => {
      progress.courseAssignments.forEach(assignment => {
        stats.totalAssignments++;
        
        if (assignment.status === 'completed') {
          stats.completedAssignments++;
        } else if (assignment.status === 'in-progress') {
          stats.inProgressAssignments++;
        } else if (assignment.status === 'overdue') {
          stats.overdueAssignments++;
        }

        // Track stats per course
        if (!stats.courseStats[assignment.courseName]) {
          stats.courseStats[assignment.courseName] = {
            totalAssignments: 0,
            completed: 0,
            inProgress: 0,
            overdue: 0
          };
        }

        stats.courseStats[assignment.courseName].totalAssignments++;
        if (assignment.status === 'completed') {
          stats.courseStats[assignment.courseName].completed++;
        } else if (assignment.status === 'in-progress') {
          stats.courseStats[assignment.courseName].inProgress++;
        } else if (assignment.status === 'overdue') {
          stats.courseStats[assignment.courseName].overdue++;
        }
      });
    });

    return stats;

  } catch (error) {
    console.error('❌ Error getting assigned course statistics:', error);
    throw error;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a course is assigned to an employee
 */
async function isCourseAssignedToEmployee(employeeEmail, courseName) {
  try {
    const progress = await AssignedCourseUserProgress.findOne({ employeeEmail });
    if (!progress) {
      return false;
    }
    
    return progress.courseAssignments.some(
      assignment => assignment.courseName === courseName
    );
  } catch (error) {
    console.error('❌ Error checking if course is assigned:', error);
    return false;
  }
}

/**
 * Get all assigned course names across all employees
 */
async function getAllAssignedCourseNames() {
  try {
    const allProgress = await AssignedCourseUserProgress.find({});
    const courseNames = new Set();
    
    allProgress.forEach(progress => {
      progress.courseAssignments.forEach(assignment => {
        courseNames.add(assignment.courseName);
      });
    });
    
    return Array.from(courseNames);
  } catch (error) {
    console.error('❌ Error getting all assigned course names:', error);
    throw error;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Model
  AssignedCourseUserProgress,
  
  // Core functions
  initializeAssignedCourseProgress,
  assignCourseToEmployee,
  updateAssignedCourseProgress,
  getEmployeeAssignedCourseProgress,
  getAllEmployeesAssignedCourseProgress,
  getEmployeeAssignedCourses,
  markAssignedCourseCompleted,
  removeAssignedCourse,
  
  // Statistics
  getAssignedCourseStatistics,
  
  // Utility functions
  isCourseAssignedToEmployee,
  getAllAssignedCourseNames
}; 