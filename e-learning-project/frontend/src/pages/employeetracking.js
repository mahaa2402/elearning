import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import './employeetracking.css'; // Import the CSS file

const EmployeeCard = ({ employee }) => {
  return (
    <div className="employee-card">
      <div className="employee-card-header">
        <div className="employee-avatar">
          <User style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h3 className="employee-name">{employee.name}</h3>
          <span className="employee-department-badge">
            {employee.department}
          </span>
        </div>
      </div>
      
      <div className="employee-info-list">
        <div className="employee-info-item">
          <Mail className="employee-info-icon" />
          <span>{employee.email}</span>
        </div>
        <div className="employee-info-item">
          <Building className="employee-info-icon" />
          <span>{employee.department}</span>
        </div>
        <div className="employee-info-item">
          <Calendar className="employee-info-icon" />
          <span>
            Joined: {new Date(employee.createdAt || employee.joinDate).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button class="button2">View Details</button>
      <div className="employee-card-footer">
        <span className="employee-footer-label">Employee ID</span>
        <span className="employee-footer-value">
          {employee._id?.slice(-8) || employee.id?.slice(-8) || 'N/A'}
        </span>
      </div>
    </div>
  );
};

const EmployeeDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to get authentication token from various possible sources
  const getAuthToken = () => {
    // Check various common storage locations for auth tokens
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('jwt') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('accessToken') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('jwt') ||
      // Check for tokens in cookies if available
      document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] ||
      document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] ||
      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    );
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(`Failed to fetch employees: ${err.message}`);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="employee-directory-container">
        <div className="employee-directory-max-width">
          <div className="employee-directory-loading-container">
            <div className="employee-directory-loading-content">
              <RefreshCw className="employee-directory-spin" style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
              <span className="employee-directory-loading-text">Loading employees...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="employee-directory-container">
        <div className="employee-directory-max-width">
          <div className="employee-directory-error-container">
            <div className="employee-directory-error-header">
              <AlertCircle style={{ width: '24px', height: '24px', color: '#dc2626' }} />
              <h2 className="employee-directory-error-title">Error Loading Employees</h2>
            </div>
            <p className="employee-directory-error-text">{error}</p>
            {error.includes('Authentication') && (
              <div className="employee-directory-warning-box">
                <p className="employee-directory-warning-text">
                  <strong>Troubleshooting:</strong> Make sure you're logged into the system before accessing this page.
                  The component is looking for authentication tokens in localStorage, sessionStorage, or cookies.
                </p>
              </div>
            )}
            <button 
              className="employee-directory-error-button"
              onClick={fetchEmployees}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-directory-container">
      <div className="employee-directory-max-width">
        {/* Header */}
        <div className="employee-directory-header">
          <div>
            <h1 className="employee-directory-title">Employee Directory</h1>
            <p className="employee-directory-subtitle">
              {employees.length > 0 ? `Total Employees: ${employees.length}` : 'Connecting to database...'}
            </p>
          </div>
          <div className="employee-directory-button-group">
            <button 
              className="employee-directory-button"
              onClick={fetchEmployees}
              disabled={loading}
            >
              <RefreshCw 
                className={loading ? 'employee-directory-spin' : ''} 
                style={{ width: '16px', height: '16px' }} 
              />
              <span>{loading ? 'Loading...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Employee Grid */}
        {employees.length === 0 && !loading && !error ? (
          <div className="employee-directory-empty-state">
            <User style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
            <h3 className="employee-directory-empty-title">No Employees Found</h3>
            <p className="employee-directory-empty-text">No employee records found in the database.</p>
            <button 
              className="employee-directory-button"
              onClick={fetchEmployees}
            >
              Try Loading Again
            </button>
          </div>
        ) : employees.length > 0 ? (
          <div className="employee-directory-grid">
            {employees.map((employee) => (
              <EmployeeCard 
                key={employee._id || employee.id || employee.email} 
                employee={employee} 
              />
            ))}
          </div>
        ) : null}

        {/* Footer */}
        <div className="employee-directory-footer">
          <p>Employee Directory System - Using existing authentication</p>
          <p className="employee-directory-footer-line">
            Auth token detected: {getAuthToken() ? '✅ Found' : '❌ Not found'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDirectory;