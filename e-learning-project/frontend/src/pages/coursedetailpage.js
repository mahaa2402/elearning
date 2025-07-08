import React, { useState, useEffect } from 'react';
import { Clock, Users, Award, BookOpen, Play, ChevronRight, User, Star } from 'lucide-react';
import './coursedetailpage.css';
import { useNavigate } from "react-router-dom";


const CourseDetailPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);

  const courseData = {
    id: 1,
    title: "ISP, GDPR & Compliance",
    description: "Master the essentials of Information Security Policy, General Data Protection Regulation, and regulatory compliance. Learn how to handle sensitive information responsibly and implement best practices in data privacy and security.",
    instructor: "Prashant Kumar Singh",
    instructorRole: "Data Protection Officer",
    duration: "4 hours",
    lessons: 12,
    employees: 24,
    rating: 4.8,
    level: "Intermediate",
    category: "Compliance & Security",
    thumbnail: "/api/placeholder/400/250",
    tags: ["GDPR", "Data Protection", "Compliance", "Security Policy"],
    outline: [
      {
        id: 1,
        title: "Introduction to Data Protection",
        description: "Understand the importance of data security in organizations and the roles of your data handling team.",
        duration: "45 Minutes",
        lessons: 6,
        completed: false
      },
      {
        id: 2,
        title: "What is ISP (Information Security Policy)?",
        description: "Learn the goals and elements of ISP, how to protect digital assets, and employee responsibilities.",
        duration: "1 Hour",
        lessons: 4,
        completed: false
      },
      {
        id: 3,
        title: "Basics of GDPR",
        description: "Introduction to the General Data Protection Regulation and its impact on organizations.",
        duration: "1 Hour",
        lessons: 8,
        completed: false
      },
      {
        id: 4,
        title: "Handling Sensitive Information",
        description: "How to classify and securely handle sensitive data like PII (Personally Identifiable Information).",
        duration: "1 Hour",
        lessons: 7,
        completed: false
      }
    ]
  };

 const navigate = useNavigate();

const handleStartLesson = (sectionId) => {
  console.log(`Starting lesson for section ${sectionId}`);
  navigate("/contentpage"); // Navigate to course page
};

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

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

      {/* Course Hero Section */}
      <section className="course-detail-hero">
        <div className="course-detail-hero-container">
          <div className="course-detail-hero-content">
            <div className="course-detail-info">
              <div className="course-detail-category">{courseData.category}</div>
              <h1 className="course-detail-title">{courseData.title}</h1>
              <p className="course-detail-description">{courseData.description}</p>
              
              <div className="course-detail-stats">
                <div className="course-detail-stat-item">
                  <Clock className="course-detail-stat-icon" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="course-detail-stat-item">
                  <BookOpen className="course-detail-stat-icon" />
                  <span>{courseData.lessons} Lessons</span>
                </div>
                <div className="course-detail-stat-item">
                  <Users className="course-detail-stat-icon" />
                  <span>{courseData.students}20 employees</span>
                </div>
                <div className="course-detail-stat-item">
                  <Star className="course-detail-stat-icon" />
                  <span>{courseData.rating}/5</span>
                </div>
              </div>

              <div className="course-detail-instructor-info">
                <div className="course-detail-instructor-avatar">
                  <User className="course-detail-instructor-icon" />
                </div>
                <div className="course-detail-instructor-details">
                  <div className="course-detail-instructor-name">{courseData.instructor}</div>
                  <div className="course-detail-instructor-role">{courseData.instructorRole}</div>
                </div>
              </div>

              <div className="course-detail-tags">
                {courseData.tags.map((tag, index) => (
                  <span key={index} className="course-detail-tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="course-detail-thumbnail">
              <img src={courseData.thumbnail} alt={courseData.title} />
              <div className="course-detail-play-overlay">
                <Play className="course-detail-play-icon" />
                <span>Preview Course</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Progress */}
      <section className="course-detail-progress-section">
        <div className="course-detail-progress-container">
          <div className="course-detail-progress-steps">
            <div className="course-detail-step active">
              <div className="course-detail-step-number">1</div>
              <div className="course-detail-step-info">
                <div className="course-detail-step-title">Course Overview</div>
                <div className="course-detail-step-status">Current</div>
              </div>
            </div>
            <div className="course-detail-step">
              <div className="course-detail-step-number">2</div>
              <div className="course-detail-step-info">
                <div className="course-detail-step-title">Learning</div>
                <div className="course-detail-step-status">Next</div>
              </div>
            </div>
            <div className="course-detail-step">
              <div className="course-detail-step-number">3</div>
              <div className="course-detail-step-info">
                <div className="course-detail-step-title">Assessment</div>
                <div className="course-detail-step-status">Locked</div>
              </div>
            </div>
            <div className="course-detail-step">
              <div className="course-detail-step-number">4</div>
              <div className="course-detail-step-info">
                <div className="course-detail-step-title">Certificate</div>
                <div className="course-detail-step-status">Locked</div>
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
            {courseData.outline.map((section, index) => (
              <div key={section.id} className="course-detail-outline-item">
                <div className="course-detail-outline-header">
                  <div className="course-detail-outline-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="course-detail-outline-content">
                    <h3 className="course-detail-outline-title">{section.title}</h3>
                    <p className="course-detail-outline-description">{section.description}</p>
                    <div className="course-detail-outline-meta">
                      <span className="course-detail-outline-duration">
                        <Clock className="course-detail-meta-icon" />
                        {section.duration}
                      </span>
                      <span className="course-detail-outline-lessons">
                        <BookOpen className="course-detail-meta-icon" />
                        {section.lessons} Lessons
                      </span>
                    </div>
                  </div>
                  <div className="course-detail-outline-actions">
                    <button 
                      className="course-detail-btn course-detail-btn-start"
                      onClick={() => handleStartLesson(section.id)}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Actions */}
      <section className="course-detail-actions-section">
        <div className="course-detail-actions-container">
          <div className="course-detail-actions-content">
            <div className="course-detail-actions-info">
              <h3>Ready to start your learning journey?</h3>
              <p>Join thousands of professionals who have already mastered these essential compliance skills.</p>
            </div>
            <div className="course-detail-actions-buttons">
              <button className="course-detail-btn course-detail-btn-primary course-detail-btn-large">
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