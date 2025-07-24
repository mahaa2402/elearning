import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'admin' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      const token = res.data.token;
      const userData = res.data.user;

      if (token && userData) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token);
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('employeeEmail', userData.email); // store email

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        window.dispatchEvent(new Event('loginSuccess'));

        alert(res.data.message || 'Login successful!');

        // ✅ ✅ ✅ Move fetch here — AFTER email is stored
        fetch(`http://localhost:5000/api/progress/${userData.email}`)
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch progress");
            return res.json();
          })
          .then(data => {
            // Use new progress structure if available, fallback to old structure
            const levelCount = data.data?.currentLevel || data.levelCount || 0;
            localStorage.setItem("levelCleared", levelCount);
          })
          .catch(err => {
            console.error("Error fetching progress:", err);
          });

        // Fetch user progress after login
        const courseName = 'ISP Basics'; // or dynamic course name if available
        fetch(`http://localhost:5000/api/progress/get?userEmail=${encodeURIComponent(userData.email)}&courseName=${encodeURIComponent(courseName)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => {
            if (!res.ok) throw new Error("Failed to fetch progress");
            return res.json();
          })
          .then(data => {
            const progress = data.progress;
            if (progress && progress.lastAccessedModule) {
              // Redirect to the last accessed module (lesson or quiz page)
              setTimeout(() => {
                navigate(`/${progress.lastAccessedModule}`);
              }, 100);
            } else {
              // Default to dashboard
              setTimeout(() => {
                navigate(userData.role === 'admin' ? '/admindashboard' : '/userdashboard');
              }, 100);
            }
          })
          .catch(err => {
            console.error("Error fetching progress:", err);
            setTimeout(() => {
              navigate(userData.role === 'admin' ? '/admindashboard' : '/userdashboard');
            }, 100);
          });

        const userRole = userData.role || res.data.role;
        setTimeout(() => {
          navigate(userRole === 'admin' ? '/admindashboard' : '/');
        }, 100);
      }

    } catch (err) {
      console.error('Login error:', {
        status: err.response?.status,
        error: err.response?.data?.error,
        details: err.response?.data?.details,
        message: err.message
      });
      const errorMessage = err.response?.data?.details || err.response?.data?.error || 'Login failed. Please check your credentials.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
