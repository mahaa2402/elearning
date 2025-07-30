import React, { useEffect, useState } from 'react';
import { Clock, Users, Award, BookOpen, Play, ChevronRight, User, Star } from 'lucide-react';
import './coursedetailpage.css';
import { useNavigate, useParams } from 'react-router-dom';
import staticCourseData from './coursedata'; // Renamed to avoid confusion

const CourseDetailPage = () => {
  const [courseData, setCourseData] = useState(null);
  const { title } = useParams();
  console.log("just foir fun",title)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses/getcoursedetailpage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });

        if (!response.ok) throw new Error('Failed to fetch course data');

        const data = await response.json();
        setCourseData(data);
      } catch (err) {
        console.error('Error loading course:', err);
      }
    };

    fetchCourse();
  }, [title]);

  const handleStartLesson = () => {
    console.log('Current courseData:', courseData);
    console.log('Looking for title:', title);
    
    // Find the course ID by matching the course name with static course data
    let foundCourseId = null;
    for (const [id, course] of Object.entries(staticCourseData)) {
      console.log(`Checking course ${id}: ${course.name} vs ${title}`);
      if (course.name === title) {
        foundCourseId = id;
        break;
      }
    }
    
    if (foundCourseId) {
      // Navigate to coursedetailpage/[courseId]/MODULE/1
      navigate(`/course/${foundCourseId}/lesson/1`);
    } else {
      console.error('Course not found in static data');
      alert('Course not found!');
    }
  };

  // Remove the alternative function since it's not needed
  // const handleStartLessonAlternative = () => { ... }

  if (!courseData) return <div className="loading">Loading course...</div>;

  return (
    <div className="course-detail-page">
      {/* Header */}
      <header className="course-detail-header">
        <div className="course-detail-header-container">
          <div className="course-detail-header-content">
            <div className="course-detail-logo-section">
              <div className="course-detail-logo">VISTA</div>
              <div className="course-detail-logo-subtitle">InnovativeLearning</div>
            </div>
            <nav className="course-detail-nav">
              <a href="#" className="course-detail-nav-link">Home</a>
              <a href="#" className="course-detail-nav-link active">Courses</a>
              <a href="#" className="course-detail-nav-link">Certifications</a>
              <a href="#" className="course-detail-nav-link">About</a>
            </nav>
            <div className="course-detail-header-actions">
              <button className="course-detail-btn course-detail-btn-primary">Login</button>
              <button className="course-detail-btn course-detail-btn-secondary">Sign Up</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="course-detail-hero">
        <div className="course-detail-hero-container">
          <div className="course-detail-hero-content">
            <div className="course-detail-info">
              <h1 className="course-detail-title">{courseData.title}</h1>
              <p className="course-detail-description">{courseData.description}</p>

              <div className="course-detail-stats">
                <div className="course-detail-stat-item">
                  <BookOpen className="course-detail-stat-icon" />
                  <span>{courseData.moduleCount || courseData.modules?.length} Lessons</span>
                </div>
              </div>           
            </div>

            <div className="course-detail-thumbnail">
              <img src={courseData.backgroundImage || "/api/placeholder/400/250"} alt={courseData.title} />
              <div className="course-detail-play-overlay">
                <Play className="course-detail-play-icon" />
                <span>Preview Course</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Outline */}
      <section className="course-detail-outline-section">
        <div className="course-detail-outline-container">
          <h2 className="course-detail-section-title">Course Outline</h2>
          <div className="course-detail-outline-list">
            {courseData.modules && courseData.modules.map((mod, index) => (
              <div key={mod.m_id} className="course-detail-outline-item">
                <div className="course-detail-outline-header">
                  <div className="course-detail-outline-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="course-detail-outline-content">
                    <h3 className="course-detail-outline-title">{mod.name}</h3>
                    <p className="course-detail-outline-description">{mod.description}</p>
                    <div className="course-detail-outline-meta">
                      <span className="course-detail-outline-duration">
                        <Clock className="course-detail-meta-icon" />
                        {mod.duration} min
                      </span>
                    </div>
                  </div>
                  <div className="course-detail-outline-actions">
                    <button 
                      className="course-detail-btn course-detail-btn-start" 
                      onClick={() => {
                        // Find course ID from static data
                        let foundCourseId = null;
                        for (const [id, course] of Object.entries(staticCourseData)) {
                          if (course.name === title) {
                            foundCourseId = id;
                            break;
                          }
                        }
                        
                        if (foundCourseId) {
                          // Navigate to specific lesson (index + 1 since lessons start from 1)
                          navigate(`/course/${foundCourseId}/lesson/1`);
                        } else {
                          alert('Course not found!');
                        }
                      }}
                    >
                      Start Module
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="course-detail-actions-section">
        <div className="course-detail-actions-container">
          <div className="course-detail-actions-content">
            <div className="course-detail-actions-info">
              <h3>Ready to start your learning journey?</h3>
              <p>Join thousands of professionals who have already mastered these essential compliance skills.</p>
            </div>
            <div className="course-detail-actions-buttons">
              <button 
                className="course-detail-btn course-detail-btn-primary course-detail-btn-large"
                onClick={handleStartLesson}
              >
                <Play className="course-detail-btn-icon" />
                Start Course
              </button>
              <button className="course-detail-btn course-detail-btn-outline course-detail-btn-large">
                <BookOpen className="course-detail-btn-icon" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;