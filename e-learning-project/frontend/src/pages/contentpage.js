import React, { useState, useRef } from "react";
import { Link } from "react-router-dom"; // Make sure to install react-router-dom
import "./contentpage.css";
import courseImg from "../assets/course.jpg"; // Replace with your image path
import lesson4Video from "../assets/lesson4video2.mp4";
import { User, ArrowRight, ArrowLeft } from "lucide-react";

const CourseDetail = () => {
  const [videoCompleted, setVideoCompleted] = useState(() => localStorage.getItem('lesson1VideoCompleted') === 'true');
  const videoRef = useRef(null);

  const handleVideoEnded = () => {
    setVideoCompleted(true);
    localStorage.setItem('lesson1VideoCompleted', 'true');
  };

  return (
    <div className="course-page">
      {/* Header Section */}
      <div className="course-header">
        <div className="course-header-text">
          <h1>
            Learn about <span className="highlight">ISP, GDPR & Compliance</span>
          </h1>
          <p>Introduction to Data Protection</p>
        </div>
        <div className="course-duration">1 hour</div>
      </div>

      <div className="course-main">
        {/* Left section with video and content */}
        <div className="course-left">
          <div className="video-preview">
            <video
              ref={videoRef}
              controls
              style={{ height: '100%', objectFit: 'cover', width: '100%' }}
              poster={courseImg}
              onEnded={handleVideoEnded}
            >
              <source src={lesson4Video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="progress-text">0% completed</div>
          </div>

          <div className="course-content">
            <h2>Data Protection Fundamentals</h2>
            <p>
              Data protection is a critical discipline that encompasses the practices, policies, and technologies used to safeguard sensitive information from unauthorized access, corruption, or loss. In today's digital landscape, organizations handle vast amounts of personal data, making robust data protection strategies essential for maintaining trust, ensuring compliance, and protecting both individual privacy and business interests.
            </p>
            
            <p>
              The foundation of effective data protection lies in understanding the various types of data your organization processes. Personal data includes any information that can identify an individual, such as names, addresses, email addresses, phone numbers, and identification numbers. Sensitive personal data requires even higher levels of protection and includes information about health, race, religion, political opinions, and financial details.
            </p>

            <h2>Internet Service Providers (ISPs) and Data Responsibilities</h2>
            <p>
              An ISP (Internet Service Provider) is a company or organization that provides access to the internet for individuals, businesses, and organizations. ISPs play a crucial role in the digital ecosystem and have significant responsibilities regarding data protection and user privacy.
            </p>
            
            <p>
              ISPs handle massive amounts of user data daily, including browsing history, connection logs, bandwidth usage, and personal information provided during account registration. This positions them as data controllers under various privacy regulations, requiring them to implement stringent data protection measures. They must ensure secure data transmission, protect user privacy, and comply with legal requirements for data retention and disclosure.
            </p>

            <h2>Compliance and Risk Management</h2>
            <p>
              Compliance with data protection regulations requires a proactive approach that goes beyond mere technical implementation. Organizations must establish comprehensive governance frameworks that include data protection impact assessments, privacy by design principles, and regular compliance monitoring. This involves appointing Data Protection Officers (DPOs) where required, maintaining records of processing activities, and implementing breach notification procedures.
            </p>

            <p>
              Risk management in data protection involves identifying, assessing, and mitigating risks associated with data processing activities. Organizations must conduct regular risk assessments to identify potential vulnerabilities, evaluate the likelihood and impact of data breaches, and implement appropriate safeguards. This includes establishing incident response plans, conducting regular security audits, and maintaining business continuity procedures.
            </p>

            <h2>Best Practices for Data Protection</h2>
            <p>
              Implementing effective data protection requires adopting industry best practices and maintaining a culture of privacy awareness. Organizations should implement privacy by design principles, ensuring that data protection considerations are integrated into all business processes and system designs from the outset. This includes conducting privacy impact assessments for new projects, implementing data minimization principles, and ensuring transparency in data processing activities.
            </p>

            <p>
              Regular training and awareness programs are essential for maintaining effective data protection. All employees should understand their responsibilities regarding data protection, recognize potential security threats, and know how to respond to privacy incidents. Organizations should also establish clear policies and procedures for data handling, access controls, and third-party data sharing agreements.
            </p>

            {/* Navigation Section */}
            <div className="lesson-navigation">
              <div className="nav-buttons">
                <button className="nav-btn prev-btn" disabled>
                  <ArrowLeft size={16} />
                  Previous Lesson
                </button>
                <li>
                  <span
                    className="disabled-lesson-link"
                    style={!videoCompleted ? { opacity: 0.5, cursor: 'not-allowed', display: 'inline-block' } : {}}
                    onClick={e => {
                      if (!videoCompleted) {
                        e.preventDefault();
                        alert('Please watch and complete the video before proceeding to Lesson 2.');
                      }
                    }}
                  >
                    {videoCompleted ? (
                      <Link to="/lesson2">
                        <span>Lesson 02: What is ISP ?</span>
                        <span className="duration">30 mins</span>
                      </Link>
                    ) : (
                      <>
                        <span>Lesson 02: What is ISP ?</span>
                        <span className="duration">30 mins</span>
                      </>
                    )}
                  </span>
                </li>
              </div>
            </div>
          </div>

          <div className="instructor-card">
            <div className="avatar">
              <User size={24} />
            </div>
            <div>
              <h4>Bulkin Simons</h4>
              <p>
                Certified Data Protection Officer with over 10 years of experience in information security and privacy compliance. Specialized in GDPR implementation, risk assessment, and privacy program development across various industries.
              </p>
            </div>
          </div>
        </div>

        {/* Right section with lesson list */}
        <div className="course-right">
          <div className="section">
            <h3>Courses</h3>
            <ul className="lesson-list">
              <li>
                <Link to="/contentpage" onClick={() => localStorage.setItem('lesson1Viewed', 'true')}>
                  <span>Lesson 01: Introduction to DataProtection</span>
                  <span className="duration">30 min</span>
                </Link>
              </li>
              <li>
                <Link to="/lesson2" onClick={e => {
                  if (localStorage.getItem('lesson1Viewed') !== 'true' || localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You should first complete Lesson 1 and pass Quiz 1 before proceeding.');
                  }
                }}>
                  <span>Lesson 02: What is ISP ?</span>
                  <span className="duration">30 mins</span>
                </Link>
              </li>
              <li>
                <Link to="/lesson3" onClick={e => {
                  if (localStorage.getItem('lesson2Viewed') !== 'true' || localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You should first complete Lesson 2 and pass Quiz 1 before proceeding.');
                  }
                }}>
                  <span>Lesson 03: Basics of GDPR</span>
                  <span className="duration">30 mins</span>
                </Link>
              </li>
              <li>
                <Link to="/lesson4" onClick={e => {
                  if (localStorage.getItem('lesson3Viewed') !== 'true' || localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You should first complete Lesson 3 and pass Quiz 1 before proceeding.');
                  }
                }}>
                  <span>Lesson 04: Handling Sensitive Information</span>
                  <span className="duration">30 mins</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="section">
            <h3>PRACTICE QUIZ</h3>
            <ul className="lesson-list">
              <li>
                <Link to="/quiz" onClick={e => {
                  if (localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You must complete and pass Quiz 1 before accessing any quizzes.');
                  }
                }}>
                  <span>Lesson 01: Introduction to Data Protection</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz2" onClick={e => {
                  if (localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You must complete and pass Quiz 1 before accessing any quizzes.');
                  }
                }}>
                  <span>Lesson 02: What is ISP ?</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz3" onClick={e => {
                  if (localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You must complete and pass Quiz 1 before accessing any quizzes.');
                  }
                }}>
                  <span>Lesson 03: Basics of GDPR</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz4" onClick={e => {
                  if (localStorage.getItem('quiz1Passed') !== 'true') {
                    e.preventDefault();
                    alert('You must complete and pass Quiz 1 before accessing any quizzes.');
                  }
                }}>
                  <span>Lesson 04: Handling Sensitive Information</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;