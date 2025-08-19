// frontend/src/pages/taskmodulepage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, Play, FileText, CheckCircle, Circle } from 'lucide-react';
import './taskmodulepage.css';

const TaskModulePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(state?.courseDetails || null);
  const [selectedModule, setSelectedModule] = useState(state?.selectedModule || null);
  const [taskDetails, setTaskDetails] = useState(state?.taskDetails || null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseDetails && selectedModule) {
      setLoading(false);
      // Set current video from selected module
      if (selectedModule.video) {
        setCurrentVideo(selectedModule.video);
      }
    } else {
      setError('No course or module data available.');
      setLoading(false);
    }
  }, [courseDetails, selectedModule]);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setCurrentVideo(module.video || null);
  };

  const isModuleCompleted = (module) => {
    // This would typically check against backend data
    // For now, we'll just check if the current module is selected
    return selectedModule && selectedModule.title === module.title;
  };

  if (loading) {
    return (
      <div className="task-module-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-module-page">
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <p className="error-text">Error: {error}</p>
          <button className="btn btn-back" onClick={() => navigate(-1)}>Back to Task Details</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-module-page">
      <header className="module-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft className="back-icon" />
          Back to Task Details
        </button>
        <div className="module-title-section">
          <h1 className="module-title">{selectedModule?.title || 'Module'}</h1>
          {selectedModule?.description && (
            <p className="module-description">{selectedModule.description}</p>
          )}
        </div>
      </header>

      <main className="module-content">
        {/* Left Side - Video and Quiz Area */}
        <div className="content-area">
          {/* Video Section */}
          {currentVideo && (
            <section className="video-section">
              <h2 className="section-title">Video Content</h2>
              <div className="video-container">
                {currentVideo.url ? (
                  <video 
                    controls 
                    className="video-player"
                    poster={currentVideo.thumbnail}
                  >
                    <source src={currentVideo.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="video-placeholder">
                    <Play className="play-icon-large" />
                    <p>Video content will be displayed here</p>
                    <p className="video-title">{currentVideo.title}</p>
                  </div>
                )}
                <div className="video-info">
                  <h3 className="video-title">{currentVideo.title}</h3>
                  {currentVideo.duration && (
                    <p className="video-duration">Duration: {currentVideo.duration}</p>
                  )}
                </div>
              </div>
            </section>
          )}

          
        </div>

        {/* Right Side - Modules Sidebar */}
        <aside className="modules-sidebar">
          <h2 className="sidebar-title">Course Modules</h2>
          <div className="modules-list">
            {courseDetails?.modules?.map((module, index) => (
              <div 
                key={index} 
                className={`module-item ${selectedModule?.title === module.title ? 'active' : ''}`}
                onClick={() => handleModuleSelect(module)}
              >
                <div className="module-item-header">
                  <h3 className="module-item-title">{module.title || `Module ${index + 1}`}</h3>
                  <div className="module-status">
                    {isModuleCompleted(module) ? (
                      <CheckCircle className="status-icon completed" />
                    ) : (
                      <Circle className="status-icon pending" />
                    )}
                  </div>
                </div>
                <div className="module-content-indicators">
                  {module.video && (
                    <span className="content-indicator video">
                      <Play className="indicator-icon" />
                      Video
                    </span>
                  )}
                                     {module.quiz && module.quiz.questions && module.quiz.questions.length > 0 && (
                     <span 
                       className="content-indicator quiz clickable"
                       onClick={(e) => {
                         e.stopPropagation();
                         navigate('/assignedquizpage', {
                           state: {
                             courseDetails: courseDetails,
                             selectedModule: module,
                             taskDetails: taskDetails
                           }
                         });
                       }}
                     >
                       <FileText className="indicator-icon" />
                       Quiz ({module.quiz.questions.length} questions)
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TaskModulePage; 