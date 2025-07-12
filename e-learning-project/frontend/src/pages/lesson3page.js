import React from "react";
import { Link } from "react-router-dom";
import "./contentpage.css";
import courseImg from "../assets/course.jpg";
import { User, ArrowRight, ArrowLeft } from "lucide-react";

const Lesson03GDPR = () => {
  return (
    <div className="course-page">
      {/* Header Section */}
      <div className="course-header">
        <div className="course-header-text">
          <h1>
            Learn about <span className="highlight">ISP, GDPR & Compliance</span>
          </h1>
          <p>Basics of General Data Protection Regulation (GDPR)</p>
        </div>
        <div className="course-duration">30 mins</div>
      </div>

      <div className="course-main">
        {/* Left section with video and content */}
        <div className="course-left">
          <div className="video-preview">
            <img src={courseImg} alt="Course preview" />
            <div className="progress-text">50% completed</div>
          </div>

          <div className="course-content">
            <h2>Introduction to GDPR</h2>
            <p>
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018, across the European Union. It represents the most significant privacy legislation in decades, fundamentally changing how organizations collect, process, and protect personal data. GDPR applies to all organizations that process personal data of EU residents, regardless of where the organization is located, making it a truly global regulation.
            </p>
            
            <p>
              GDPR was designed to harmonize data protection laws across EU member states, giving individuals greater control over their personal data and imposing strict obligations on organizations that handle such data. The regulation aims to strengthen and unify data protection for all individuals within the EU while addressing the challenges posed by modern digital technologies and data processing practices.
            </p>

            <h2>Key Principles of GDPR</h2>
            <p>
              GDPR establishes seven fundamental principles that must guide all personal data processing activities. Lawfulness, fairness, and transparency require that data processing must have a legal basis, be conducted fairly, and be transparent to the data subject. Purpose limitation mandates that personal data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.
            </p>
            
            <p>
              Data minimization requires that personal data must be adequate, relevant, and limited to what is necessary for the processing purposes. Accuracy mandates that personal data must be accurate and kept up to date, with reasonable steps taken to ensure inaccurate data is erased or rectified. Storage limitation requires that personal data be kept in a form that permits identification of data subjects for no longer than necessary for the processing purposes.
            </p>

            <h2>Individual Rights Under GDPR</h2>
            <p>
              GDPR significantly strengthens individual rights regarding personal data. The right to be informed requires organizations to provide clear and transparent information about their data processing activities through privacy notices. The right of access allows individuals to obtain confirmation of whether their personal data is being processed and, if so, to access that data along with specific information about the processing.
            </p>
            
            <p>
              The right to rectification enables individuals to have inaccurate personal data corrected and incomplete data completed. The right to erasure, also known as the "right to be forgotten," allows individuals to request deletion of their personal data in certain circumstances. The right to restrict processing enables individuals to limit how their personal data is processed in specific situations.
            </p>

            <h2>Enforcement and Penalties</h2>
            <p>
              GDPR enforcement is carried out by supervisory authorities in each EU member state, with the lead authority principle determining which authority takes the lead in cross-border cases. Supervisory authorities have extensive powers including conducting investigations, accessing premises and data, ordering compliance measures, and imposing administrative fines.
            </p>
            
            <p>
              GDPR provides for significant financial penalties, with administrative fines up to €20 million or 4% of annual global turnover, whichever is higher, for the most serious violations. Lower-tier violations can result in fines up to €10 million or 2% of annual global turnover. The regulation also provides for other corrective measures including warnings, reprimands, processing bans, and certification withdrawals.
            </p>

            {/* Navigation Section */}
            <div className="lesson-navigation">
              <div className="nav-buttons">
                <Link to="/lesson2" className="nav-btn prev-btn">
                  <ArrowLeft size={16} />
                  Previous Lesson
                </Link>
                <Link to="/lesson4" className="nav-btn next-btn">
                  Next Lesson
                  <ArrowRight size={16} />
                </Link>
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
                <Link to="/contentpage">
                  <span>Lesson 01: Introduction to DataProtection</span>
                  <span className="duration">30 min</span>
                </Link>
              </li>
              <li>
                <Link to="/lesson2">
                  <span>Lesson 02: What is ISP ?</span>
                  <span className="duration">30 mins</span>
                </Link>
              </li>
              <li className="active">
                <Link to="/lesson3">
                  <span>Lesson 03: Basics of GDPR</span>
                  <span className="duration">30 mins</span>
                </Link>
              </li>
              <li>
                <Link to="/lesson4">
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
                <Link to="/quiz">
                  <span>Lesson 01: Introduction to Data Protection</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz2">
                  <span>Lesson 02: What is ISP ?</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz3">
                  <span>Lesson 03: Basics of GDPR</span>
                </Link>
              </li>
              <li>
                <Link to="/quiz4">
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

export default Lesson03GDPR;