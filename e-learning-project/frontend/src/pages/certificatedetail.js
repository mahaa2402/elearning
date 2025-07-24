import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './certificatedetail.css';

const CertificateDetails = () => {
  const { id } = useParams(); // employee ID passed from route
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthToken = () => {
    return (
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('jwt') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('accessToken') ||
      sessionStorage.getItem('token') ||
      sessionStorage.getItem('jwt') ||
      document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1] ||
      document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] ||
      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
    );
  };

  const fetchCertificateDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('No authentication token found. Please log in.');
      }

      if (!id) {
        throw new Error('No employee ID provided');
      }
      console.log(id)

      // Use the correct endpoint for fetching all certificates for an employee
      const endpoint = `http://localhost:5000/api/certificates/${id}`;
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      //console.log(res)

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No certificates found for this employee');
        } else {
          throw new Error('Failed to fetch certificate details');
        }
      }

      const data = await res.json();
      console.log("heloooooooooo",data)
      //setCertificates(Array.isArray(data) ? data : [data]);
      setCertificates(Array.isArray(data.certificates) ? data.certificates : []);
      console.log('empty',certificates)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificateDetails();
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="certificate-page">
        <p className="loading-msg">Loading certificate details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-page">
        <p className="error-msg">❌ {error}</p>
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Go Back</button>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="certificate-page">
        <p className="error-msg">No certificates found for this employee</p>
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Go Back</button>
      </div>
    );
  }

  return (
    <div className="certificate-page">
      <h1>🎓 Certificate Details</h1>
      <div className="certificates-container">
        <h2>Certificates ({certificates.length})</h2>
        {certificates.map((certificate, index) => (
          <div key={certificate._id || index} className="certificate-box">
            <p><strong>🧑‍💼 Employee Name:</strong> {certificate.employeeName || 'N/A'}</p>
            <p><strong>📧 Employee Email:</strong> {certificate.employeeEmail || 'N/A'}</p>
            <p><strong>🆔 Employee ID:</strong> {certificate.employeeId || 'N/A'}</p>
            <p><strong>📘 Course Title:</strong> {certificate.courseTitle || 'N/A'}</p>
            <p><strong>📅 Earned On:</strong> {certificate.date && !isNaN(Date.parse(certificate.date)) ? new Date(certificate.date).toLocaleDateString() : (certificate.createdAt && !isNaN(Date.parse(certificate.createdAt)) ? new Date(certificate.createdAt).toLocaleDateString() : 'N/A')}</p>
            {certificate.module && <p><strong>📚 Module:</strong> {certificate.module}</p>}
            {certificate._id && <p><strong>🏅 Certificate ID:</strong> {certificate._id}</p>}
            {certificate.awarder && <p><strong>🎖️ Awarded By:</strong> {certificate.awarder}</p>}
            {certificate.description && <p><strong>📝 Description:</strong> {certificate.description}</p>}
            {certificate.createdAt && !isNaN(Date.parse(certificate.createdAt)) && (
              <p><strong>🕒 Created At:</strong> {new Date(certificate.createdAt).toLocaleString()}</p>
            )}
            {certificate.updatedAt && !isNaN(Date.parse(certificate.updatedAt)) && (
              <p><strong>🕒 Updated At:</strong> {new Date(certificate.updatedAt).toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Go Back</button>
    </div>
  );
};

export default CertificateDetails;