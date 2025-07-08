// src/pages/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    role: 'admin' // Default to admin
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  // Example login handler (in your login component)
const handleLogin = async (email, password, role) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('userId', data.user.id); // Store userId if needed
    window.location.href = '/dashboard'; // Redirect to dashboard
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      const token = res.data.token;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token);
      }

      const userData = res.data.user;
      if (userData) {
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      window.dispatchEvent(new Event('loginSuccess'));

      alert(res.data.message || 'Login successful!');

      const userRole = userData.role || res.data.role;
      
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/');
        }
      }, 100);

    } catch (err) {
      // Enhanced error logging
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