// frontend/src/pages/taskdetailpage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, Clock, User, ChevronLeft, Play, FileText } from 'lucide-react';
import './taskdetail.css';

const TaskDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(state?.task || null);
  const [videos, setVideos] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAdminNameString = (assignedBy) => {
    if (!assignedBy) return 'Admin';
    if (typeof assignedBy.adminName === 'string') return assignedBy.adminName;
    return assignedBy.adminEmail?.split('@')[0] || 'Admin';
  };

  const fetchTaskDetails = async () => {
    if (!task?._id) {
      setError('No task ID provided.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`http://localhost:5000/api/assigned-tasks/${task._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        } else if (response.status === 404) {
          throw new Error('Task not found or invalid task ID.');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch task details: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      let fetchedTask = data.task || data;

      if (!fetchedTask?._id) {
        setTask(null);
        throw new Error('Task not found.');
      }

      fetchedTask.videos = fetchedTask.videos || [];
      fetchedTask.quizzes = fetchedTask.quizzes || [];
      setTask(fetchedTask);

      const fetchedVideos = Array.isArray(fetchedTask.videos) ? fetchedTask.videos.map(video => ({
        id: video._id || video.id,
        title: video.title || 'Untitled Video',
        url: video.url || '#',
        thumbnail: video.thumbnail || '/api/placeholder/300/180',
        duration: video.duration || 'Unknown duration'
      })) : [];
      setVideos(fetchedVideos);

      const fetchedQuizzes = Array.isArray(fetchedTask.quizzes) ? fetchedTask.quizzes.map(quiz => ({
        id: quiz._id || quiz.id,
        title: quiz.title || 'Untitled Quiz',
        questions: quiz.questions || [],
        passingScore: quiz.passingScore || 70
      })) : [];
      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error('Error fetching task details:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date() && new Date().getTime() - new Date(deadline).getTime() > 0;
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'assigned': return 'info';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="task-detail-page">
      <header className="task-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft className="back-icon" />
          Back to Dashboard
        </button>
        <h1 className="task-title">{task?.taskTitle || 'Task Details'}</h1>
      </header>

      <main className="task-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading task details...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <AlertCircle className="error-icon" />
            <p className="error-text">Error: {error}</p>
            <button className="btn btn-retry" onClick={fetchTaskDetails}>Retry</button>
          </div>
        ) : !task ? (
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" />
            <p className="empty-state-text">No task data available.</p>
            <button className="btn btn-back" onClick={() => navigate(-1)}>Back to Dashboard</button>
          </div>
        ) : (
          <>
            <section className="task-info-section">
              <h2 className="section-title">Task Information</h2>
              <div className="task-info-grid">
                <div className="info-item">
                  <label className="info-label">Task Title</label>
                  <p className="info-value">{task.taskTitle}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Module</label>
                  <p className="info-value">{task.module}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Assigned By</label>
                  <div className="instructor-info">
                    <User className="instructor-icon" />
                    <p className="info-value">{getAdminNameString(task.assignedBy)}</p>
                  </div>
                </div>
                <div className="info-item">
                  <label className="info-label">Assigned Date</label>
                  <div className="date-info">
                    <Calendar className="date-icon" />
                    <p className="info-value">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="info-item">
                  <label className="info-label">Deadline</label>
                  <div className="deadline-info">
                    <Clock className="clock-icon" />
                    <p className={`info-value ${isOverdue(task.deadline) ? 'overdue' : ''}`}>
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                    <p className={`days-remaining ${isOverdue(task.deadline) ? 'overdue' : getDaysRemaining(task.deadline) <= 3 ? 'urgent' : ''}`}>
                      {isOverdue(task.deadline) ? 'OVERDUE' : getDaysRemaining(task.deadline) === 0 ? 'Due Today' : `${getDaysRemaining(task.deadline)} days left`}
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <label className="info-label">Priority</label>
                  <p className={`priority priority-${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase()}
                  </p>
                </div>
                <div className="info-item">
                  <label className="info-label">Status</label>
                  <p className={`status-badge status-${getStatusColor(task.status?.toLowerCase())}`}>
                    {task.status?.toUpperCase() || 'ACTIVE'}
                  </p>
                </div>
                {task.description && (
                  <div className="info-item description">
                    <label className="info-label">Description</label>
                    <p className="info-value">{task.description}</p>
                  </div>
                )}
                <div className="info-item">
                  <label className="info-label">Estimated Hours</label>
                  <p className="info-value">{task.estimatedHours || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Total Assignees</label>
                  <p className="info-value">{task.totalAssignees || 0}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Completed Count</label>
                  <p className="info-value">{task.completedCount || 0}</p>
                </div>
              </div>
            </section>

           </>
        )}
      </main>
    </div>
  );
};

export default TaskDetailPage;