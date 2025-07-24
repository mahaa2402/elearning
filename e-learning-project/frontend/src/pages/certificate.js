import React, { useEffect, useState } from 'react';
import './certificate.css';

const CertificatePage = () => {
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get employee data from localStorage or user session
  const getEmployeeData = () => {
    let employeeName = "Employee Name";
    let employeeId = "Unknown ID";
    
    // Try to get from user session first
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        employeeName = user.name || user.email?.split('@')[0] || "Employee Name";
        employeeId = user._id || user.id || "Unknown ID";
      } catch (e) {
        console.error('Error parsing user session:', e);
      }
    }
    
    // Fallback to individual localStorage items
    if (employeeName === "Employee Name") {
      employeeName = localStorage.getItem('employeeName') || "Employee Name";
    }
    if (employeeId === "Unknown ID") {
      employeeId = localStorage.getItem('employeeId') || "Unknown ID";
    }
    
    return { employeeName, employeeId };
  };

  const { employeeName, employeeId } = getEmployeeData();
  const courseTitle = "Information Security & Data Protection";
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    const saveCertificate = async () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:5000/api/certificate/save-certificate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            courseTitle,
            date,
            employeeName,
            employeeId
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (response.status === 403) {
            setError('Session expired. Please login again.');
            // Clear invalid token
            localStorage.removeItem('authToken');
            localStorage.removeItem('token');
          } else {
            setError(data.error || 'Failed to save certificate');
          }
        } else {
          setCertificateData(data.certificate);
          setSuccess(true);
          console.log('Certificate saved successfully:', data);
        }
      } catch (error) {
        console.error('Failed to store certificate:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    saveCertificate();
  }, [courseTitle, date]);

  if (loading) {
    return (
      <div className="certificate-container">
        <div className="certificate">
          <h2>Saving Certificate...</h2>
          <p>Please wait while we save your certificate.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-container">
        <div className="certificate">
          <h2>Error</h2>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-container">
      <div className="certificate">
        {success && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
          </div>
        )}
        
        <h1 className="certificate-title">Certificate of Completion</h1>
        <p className="certificate-text">This is to certify that</p>
        <h2 className="employee-name">{employeeName}</h2>
        <p className="certificate-text">has successfully completed the course</p>
        <h3 className="course-title">{courseTitle}</h3>
        <p className="date">Date: {date}</p>

        <div className="signature-section">
          <div className="signature">
            <p>Authorized Signature</p>
            <hr />
          </div>
        </div>

        <button className="print-button" onClick={() => window.print()}>Print Certificate</button>
      </div>
    </div>
  );
};

export default CertificatePage;
