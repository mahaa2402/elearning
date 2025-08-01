// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import courseData from './coursedata';
// import './lessonpage.css';

// function LessonPage() {
//   const { courseId, lessonId } = useParams();
//   const navigate = useNavigate();
//   console.log("lesson id is comin from sarva",lessonId,courseId)
//   const course = courseData[courseId];
//   const lesson = course?.lessons[lessonId];

//   if (!course || !lesson) return <h2>Lesson not found</h2>;

//   return (
//     <div className="lesson-wrapper">
//       {/* 🔶 TOP BAR */}
//       <div className="top-bar">
//         <div>
//           <h3>
//             Learn about <span>{course.name}</span>
//           </h3>
//           <p className="subtitle">{lesson.title}</p>
//         </div>
//         <div className="duration-text">{course.duration || '1 hour'}</div>
//       </div>

//       <div className="lesson-container">
//         {/* LEFT: Video + Notes */}
//         <div className="lesson-content">
//           <video width="100%" height="auto" controls>
//             <source src={lesson.videoUrl} type="video/mp4" />
//           </video>
//           <p className="progress-text">0% completed</p>
//           <div className="lesson-paragraphs">
//             {lesson.content.map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: Sidebar   - need to fetch from user progress after quiz completion/////////////////////////// */}
//         <div className="lesson-sidebar">
//           <div className="sidebar-section">
//             <h4>Courses</h4>
//             {Object.entries(course.lessons).map(([id, l]) => (
//               <button
//                 key={id}
//                 className={`lesson-button ${id === lessonId ? 'active' : ''}`}
//                 disabled={parseInt(id) > parseInt(lessonId)} // lock future lessons
//                 onClick={() => navigate(`/course/${courseId}/lesson/${id}`)}
//               >
//                 Lesson {id}: {l.title.split(' ').slice(0, 3).join(' ')}...
//                 <span className="duration">30 mins</span>
//               </button>
//             ))}
//           </div>

//           <div className="sidebar-section">
//             <h4>Practice Quiz</h4>
//             {Object.entries(course.lessons).map(([id, l]) => (
//               <button
//                 key={id}
//                 className={`quiz-button ${id === lessonId ? 'active' : ''}`}
//                 disabled={parseInt(id) > parseInt(lessonId)}>
                  
//                 Quiz {id}: {l.title.split(' ').slice(0, 2).join(' ')}...
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LessonPage;


import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseData from './coursedata';
import './lessonpage.css';

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const course = courseData[courseId];
  const lessons = course?.lessons || {};
  const lessonKeys = Object.keys(lessons);
  const firstLessonId = lessonKeys[0];
  const lesson = lessons[lessonId];

  // Redirect to first lesson if lessonId is missing or invalid — REPLACE to preserve browser history
  useEffect(() => {
    if (course && (!lessonId || !lessons[lessonId])) {
      navigate(`/course/${courseId}/lesson/${firstLessonId}`, { replace: true });
    }
  }, [courseId, lessonId, course, lessons, firstLessonId, navigate]);

  if (!course || !lesson) return <h2>Lesson not found</h2>;

  return (
    <div className="lesson-wrapper">
      {/* 🔶 TOP BAR */}
      <div className="top-bar">
        <div>
          <h3>
            Learn about <span>{course.name}</span>
          </h3>
          <p className="subtitle">{lesson.title}</p>
        </div>
        <div className="duration-text">{course.duration || '1 hour'}</div>
      </div>

      <div className="lesson-container">
        {/* LEFT: Video + Notes */}
        <div className="lesson-content">
          <video width="100%" height="auto" controls>
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>
          <p className="progress-text">0% completed</p>
          <div className="lesson-paragraphs">
            {lesson.content.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="lesson-sidebar">
          <div className="sidebar-section">
            <h4>Courses</h4>
            {lessonKeys.map((id, idx) => (
              <button
                key={id}
                className={`lesson-button ${id === lessonId ? 'active' : ''}`}
                disabled={lessonKeys.indexOf(lessonId) < idx} // disable future lessons
                onClick={() => navigate(`/course/${courseId}/lesson/${id}`)}
              >
                Lesson {id}: {lessons[id].title.split(' ').slice(0, 3).join(' ')}...
                <span className="duration">30 mins</span>
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <h4>Practice Quiz</h4>
            {lessonKeys.map((id, idx) => (
              <button
                key={id}
                className={`quiz-button ${id === lessonId ? 'active' : ''}`}
                disabled={lessonKeys.indexOf(lessonId) < idx}
                onClick={() => navigate(`/quiz/${courseId}/${id}`)}
              >
                Quiz {id}: {lessons[id].title.split(' ').slice(0, 2).join(' ')}...
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default LessonPage;
