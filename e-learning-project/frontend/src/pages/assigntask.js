import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, BookOpen, Send, X, Search, Check } from 'lucide-react';

const TaskAssignment = () => {
  const [formData, setFormData] = useState({
    taskTitle: '',
    description: '',
    assignees: [],
    deadline: '',
    priority: 'medium',
    reminderDays: '3'
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [courses, setCourses] = useState([]); // New state for courses
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true); // New loading state for courses
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses from API for task title dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in again.');
          setCourses([]);
          setCoursesLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/admin/courses', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Courses API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log('Courses API Response:', result);
        
        let courseData;
        if (result && Array.isArray(result)) {
          courseData = result;
        } else if (result && result.courses && Array.isArray(result.courses)) {
          courseData = result.courses;
        } else {
          console.error('Unexpected courses response format:', result);
          setError('Unexpected response format from courses server.');
          setCourses([]);
          setCoursesLoading(false);
          return;
        }

        // Extract course names from the admin_courses response
        const courseNames = courseData.map(course => course.name).filter(Boolean);
        setCourses(courseNames);
        console.log('Available course names:', courseNames);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(`Failed to load courses: ${err.message}`);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in again.');
          setEmployees([]);
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/employee/employees', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log('Employee API Response:', result);
        
        let employeeData;
        if (result.employees && Array.isArray(result.employees)) {
          employeeData = result.employees;
        } else if (Array.isArray(result)) {
          employeeData = result;
        } else {
          console.error('Unexpected response format:', result);
          setError('Unexpected response format from server.');
          setEmployees([]);
          setLoading(false);
          return;
        }

        const validEmployees = employeeData.filter(emp => 
          emp.email && typeof emp.email === 'string' && 
          emp._id && emp._id.length === 24
        );
        if (validEmployees.length !== employeeData.length) {
          console.warn('Some employees are missing required fields:', employeeData);
          setError('Some employee data is invalid (missing email or ID).');
        }
        setEmployees(validEmployees);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(`Failed to load employees: ${err.message}`);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#ffa502';
    }
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeSelect = (employee) => {
    if (!employee._id || employee._id.length !== 24) {
      console.error('Invalid employee ID:', employee);
      setError('Cannot select employee with invalid ID.');
      return;
    }
    const isSelected = selectedEmployees.find(emp => emp._id === employee._id);
    if (isSelected) {
      setSelectedEmployees(prev => prev.filter(emp => emp._id !== employee._id));
    } else {
      setSelectedEmployees(prev => [...prev, employee]);
    }
    console.log('Updated selectedEmployees:', selectedEmployees);
  };

  const removeEmployee = (employeeId) => {
    setSelectedEmployees(prev => prev.filter(emp => emp._id !== employeeId));
  };

  const getFilteredEmployees = () => {
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== Submitting Task ===');
    console.log('Form Data:', formData);
    console.log('Selected Employees:', selectedEmployees);

    const requiredFields = ['taskTitle', 'description', 'deadline'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!selectedEmployees.length) {
      setError('Please select at least one employee');
      return;
    }

    const invalidEmployees = selectedEmployees.filter(emp => !emp._id || emp._id.length !== 24 || !emp.email);
    if (invalidEmployees.length > 0) {
      setError('Invalid employee data detected');
      console.error('Invalid employees:', invalidEmployees);
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime())) {
      setError('Invalid deadline format');
      return;
    }








///////////////////////////////



    const taskData = {
      taskTitle: formData.taskTitle,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority || 'medium',
      reminderDays: formData.reminderDays ? parseInt(formData.reminderDays) : 3,
      assignees: selectedEmployees.map(emp => ({
        id: emp._id,
        name: emp.name,
        employeeEmail: emp.email, // Changed to employeeEmail to match backend
        department: emp.department
      }))
    };

    let result = null; // Initialize result to avoid no-undef error
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      console.log('Sending taskData:', JSON.stringify(taskData, null, 2));
      const response = await fetch('http://localhost:5000/api/assigned-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(taskData)
      });

      result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to assign task: ${result.details || 'Unknown error'}`
        );
      }

      setSuccess('Task assigned successfully!');
      setFormData({
        taskTitle: '',
        description: '',
        assignees: [],
        deadline: '',
        priority: 'medium',
        reminderDays: '3'
      });
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Submission error:', error);
      const errorDetails = result && result.missingFields
        ? ` - ${result.missingFields.join(', ')}`
        : ' - Check server logs for details';
      setError(`Error: ${error.message}${errorDetails}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check token validity
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    if (!token) {
      console.log('No token found!');
      return false;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      console.log('Token verification result:', result);
      
      if (result.valid && result.user.role === 'admin') {
        console.log('Token is valid and user is admin');
        return true;
      } else {
        console.log('Token invalid or user is not admin');
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assign Learning Task</h1>
              <p className="text-gray-600">Create and assign e-learning modules to employees with deadlines</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title (Course) *
                </label>
                {coursesLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Loading courses...
                  </div>
                ) : (
                  <>
                    <select
                      name="taskTitle"
                      value={formData.taskTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a course for task</option>
                      {courses.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                      ))}
                      <option value="custom">+ Add Custom Task Title</option>
                    </select>
                    {formData.taskTitle === 'custom' && (
                      <input
                        type="text"
                        name="customTaskTitle"
                        placeholder="Enter custom task title..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        onChange={(e) => setFormData(prev => ({ ...prev, taskTitle: e.target.value }))}
                      />
                    )}
                  </>
                )}
                {courses.length === 0 && !coursesLoading && (
                  <p className="text-sm text-gray-500 mt-1">No courses available. Please add courses first.</p>
                )}
                {error && error.includes('courses') && (
                  <p className="text-sm text-red-500 mt-1">Failed to load courses. You can still enter a custom task title.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed instructions for the task..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getPriorityColor(formData.priority) }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder (Days Before)
                </label>
                <select
                  name="reminderDays"
                  value={formData.reminderDays}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">1 Week</option>
                  <option value="14">2 Weeks</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send size={18} />
                <span>{isSubmitting ? 'Assigning...' : 'Assign Task'}</span>
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <div className="font-medium mb-2">Error:</div>
                  <div>{error}</div>
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer font-medium">Debug Information</summary>
                                         <div className="mt-2 p-2 bg-red-100 rounded">
                       <p>Selected employees: {selectedEmployees.length}</p>
                       <p>Task title: {formData.taskTitle || 'Not set'}</p>
                       <p>Deadline: {formData.deadline || 'Not set'}</p>
                       <p>Check browser console for more details</p>
                     </div>
                  </details>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  {success}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Employees ({selectedEmployees.length} selected)
              </h3>
              {selectedEmployees.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedEmployees([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500">
                {filteredEmployees.length} employees available
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading employees...</div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No employees found.</div>
              ) : (
                filteredEmployees.map(employee => {
                  const isSelected = selectedEmployees.find(emp => emp._id === employee._id);
                  return (
                    <div
                      key={employee._id}
                      onClick={() => handleEmployeeSelect(employee)}
                      className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        <div className="text-xs text-gray-400">{employee.department}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedEmployees.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Selected Employees ({selectedEmployees.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map(employee => (
                    <div
                      key={employee._id}
                      className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{employee.name}</span>
                      <button
                        type="button"
                        onClick={() => removeEmployee(employee._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {(formData.taskTitle || selectedEmployees.length > 0) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-3">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Task:</span>
                   <span className="font-medium">{formData.taskTitle === 'custom' ? 'Custom Task' : (formData.taskTitle || 'Untitled Task')}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-600">Assignees:</span>
                   <span className="font-medium">{selectedEmployees.length} employee(s)</span>
                 </div>
               </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">
                    {formData.deadline ? new Date(formData.deadline).toLocaleString() : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Priority:</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: getPriorityColor(formData.priority) }}
                    >
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskAssignment;