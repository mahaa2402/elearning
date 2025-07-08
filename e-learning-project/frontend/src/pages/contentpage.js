import React from "react";
import "./contentpage.css";
import courseImg from "../assets/course.jpg"; // Replace with your image path
import { User } from "lucide-react";

const CourseDetail = () => {
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
            <img src={courseImg} alt="Course preview" />
            <div className="progress-text">0% completed</div>
          </div>

          <div className="course-content">
            <h2>Data protection</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
            </p>

            <h2>Introduction to Information Security</h2>
            <p>
              Protection of information and IT systems from unauthorized access...
            </p>

            <h2>Introduction to GDPR</h2>
            <p>
              EU regulation effective from May 2018. Applies to any organization...
            </p>
          </div>

          <div className="instructor-card">
            <div className="avatar">
              <User size={24} />
            </div>
            <div>
              <h4>Bulkin Simons</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod...
              </p>
            </div>
          </div>
        </div>

        {/* Right section with lesson list */}
        <div className="course-right">
          <div className="section">
            <h3>Courses</h3>
            <ul className="lesson-list">
              <li className="active">
                <span>Lesson 01: Introduction about XD</span>
                <span className="duration">30 min</span>
              </li>
              <li>
                <span>Lesson 02: What is ISP ?</span>
                <span className="duration">30 mins</span>
              </li>
              <li>
                <span>Lesson 03: Basics of GDPR</span>
                <span className="duration">30 mins</span>
              </li>
              <li>
                <span>Lesson 04: Handling Sensitive Information</span>
                <span className="duration">30 mins</span>
              </li>
            </ul>
          </div>

          <div className="section">
            <h3>PRACTICE QUIZ</h3>
            <ul className="lesson-list">
              <li>
                <span>Lesson 01: Introduction about XD</span>
              </li>
              <li>
                <span>Lesson 02: What is ISP ?</span>
              </li>
              <li>
                <span>Lesson 03: Basics of GDPR</span>
              </li>
              <li>
                <span>Lesson 04: Handling Sensitive Information</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
