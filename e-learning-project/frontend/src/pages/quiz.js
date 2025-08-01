// import React, { useState, useEffect } from 'react';
// import './quiz.css';
// import { useParams, useNavigate } from 'react-router-dom';

// const email = localStorage.getItem("employeeEmail"); // stored at login
// const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
// const thisLesson = 4; // Set this based on current lesson

// // Update level in localStorage and backend if eligible
// if (thisLesson === currentLevel + 1) {
//   const updatedLevel = thisLesson;
//   localStorage.setItem("levelCleared", updatedLevel);

//   fetch("http://localhost:5000/api/update-progress", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, levelCount: updatedLevel }),
//   });
// }

// const questionSets = [
//   [
//     // Set 1
//     {
//       id: 1,
//       question: "What is the goal of data protection?",
//       options: [
//         { id: 'a', text: 'Information Security Policy' },
//         { id: 'b', text: 'Information Secure Policy' },
//         { id: 'c', text: 'Information Social Policy' },
//         { id: 'd', text: 'Intro Security Policy' },
//         { id: 'e', text: 'Information Security Policy' }
//       ],
//       correctAnswer: 'a'
//     },
//     {
//       id: 2,
//       question: "What does ISP stand for?",
//       options: [
//         { id: 'a', text: 'Information Security Policy' },
//         { id: 'b', text: 'Information Secure Policy' },
//         { id: 'c', text: 'Internet Service Provider' },
//         { id: 'd', text: 'Intro Security Policy' },
//         { id: 'e', text: 'Information System Protocol' }
//       ],
//       correctAnswer: 'c'
//     },
//     {
//       id: 3,
//       question: "Which of the following is a primary service offered by ISPs?",
//       options: [
//         { id: 'a', text: 'Internet Access' },
//         { id: 'b', text: 'Email Services' },
//         { id: 'c', text: 'Web Hosting' },
//         { id: 'd', text: 'Domain Registration' },
//         { id: 'e', text: 'All of the above' }
//       ],
//       correctAnswer: 'e'
//     },
//     {
//       id: 4,
//       question: "What is the most common type of internet connection provided by ISPs to residential customers?",
//       options: [
//         { id: 'a', text: 'Dial-up Connection' },
//         { id: 'b', text: 'Broadband Connection' },
//         { id: 'c', text: 'Satellite Connection' },
//         { id: 'd', text: 'Fiber Optic Connection' },
//         { id: 'e', text: 'DSL Connection' }
//       ],
//       correctAnswer: 'b'
//     },
//     {
//       id: 5,
//       question: "Which regulation is most associated with data privacy in Europe?",
//       options: [
//         { id: 'a', text: 'HIPAA' },
//         { id: 'b', text: 'GDPR' },
//         { id: 'c', text: 'FERPA' },
//         { id: 'd', text: 'SOX' },
//         { id: 'e', text: 'PCI DSS' }
//       ],
//       correctAnswer: 'b'
//     }
//   ],
//   [
//     // Set 2
//     {
//       id: 1,
//       question: "Which of the following is NOT a type of ISP?",
//       options: [
//         { id: 'a', text: 'Dial-up' },
//         { id: 'b', text: 'Broadband' },
//         { id: 'c', text: 'Satellite' },
//         { id: 'd', text: 'Fiber Optic' },
//         { id: 'e', text: 'Bluetooth' }
//       ],
//       correctAnswer: 'e'
//     },
//     {
//       id: 2,
//       question: "What does GDPR stand for?",
//       options: [
//         { id: 'a', text: 'General Data Protection Regulation' },
//         { id: 'b', text: 'Global Data Privacy Regulation' },
//         { id: 'c', text: 'Government Data Policy Regulation' },
//         { id: 'd', text: 'General Data Privacy Rules' },
//         { id: 'e', text: 'Global Data Protection Rules' }
//       ],
//       correctAnswer: 'a'
//     },
//     {
//       id: 3,
//       question: "Which is a secure way to protect your online accounts?",
//       options: [
//         { id: 'a', text: 'Use strong, unique passwords' },
//         { id: 'b', text: 'Share passwords with friends' },
//         { id: 'c', text: 'Use the same password everywhere' },
//         { id: 'd', text: 'Write passwords on sticky notes' },
//         { id: 'e', text: 'None of the above' }
//       ],
//       correctAnswer: 'a'
//     },
//     {
//       id: 4,
//       question: "Which of these is a benefit of broadband over dial-up?",
//       options: [
//         { id: 'a', text: 'Faster speeds' },
//         { id: 'b', text: 'Always on connection' },
//         { id: 'c', text: 'Can use phone and internet at same time' },
//         { id: 'd', text: 'All of the above' },
//         { id: 'e', text: 'None of the above' }
//       ],
//       correctAnswer: 'd'
//     },
//     {
//       id: 5,
//       question: "What is phishing?",
//       options: [
//         { id: 'a', text: 'A type of cyber attack' },
//         { id: 'b', text: 'A way to catch fish' },
//         { id: 'c', text: 'A type of broadband' },
//         { id: 'd', text: 'A secure password' },
//         { id: 'e', text: 'None of the above' }
//       ],
//       correctAnswer: 'a'
//     }
//   ],
//   [
//     // Set 3
//     {
//       id: 1,
//       question: "Which of these is NOT a broadband technology?",
//       options: [
//         { id: 'a', text: 'DSL' },
//         { id: 'b', text: 'Cable' },
//         { id: 'c', text: 'Fiber Optic' },
//         { id: 'd', text: 'Dial-up' },
//         { id: 'e', text: 'Satellite' }
//       ],
//       correctAnswer: 'd'
//     },
//     {
//       id: 2,
//       question: "What is the main purpose of a firewall?",
//       options: [
//         { id: 'a', text: 'To heat your house' },
//         { id: 'b', text: 'To block unauthorized access' },
//         { id: 'c', text: 'To provide internet' },
//         { id: 'd', text: 'To store data' },
//         { id: 'e', text: 'To clean viruses' }
//       ],
//       correctAnswer: 'b'
//     },
//     {
//       id: 3,
//       question: "Which of these is a strong password?",
//       options: [
//         { id: 'a', text: 'password123' },
//         { id: 'b', text: 'qwerty' },
//         { id: 'c', text: 'MyDog$2025!' },
//         { id: 'd', text: '123456' },
//         { id: 'e', text: 'abcde' }
//       ],
//       correctAnswer: 'c'
//     },
//     {
//       id: 4,
//       question: "Which of these is a responsibility of an ISP?",
//       options: [
//         { id: 'a', text: 'Provide internet access' },
//         { id: 'b', text: 'Protect user privacy' },
//         { id: 'c', text: 'Maintain network infrastructure' },
//         { id: 'd', text: 'All of the above' },
//         { id: 'e', text: 'None of the above' }
//       ],
//       correctAnswer: 'd'
//     },
//     {
//       id: 5,
//       question: "What is malware?",
//       options: [
//         { id: 'a', text: 'A type of software designed to harm computers' },
//         { id: 'b', text: 'A type of hardware' },
//         { id: 'c', text: 'A secure password' },
//         { id: 'd', text: 'A type of broadband' },
//         { id: 'e', text: 'None of the above' }
//       ],
//       correctAnswer: 'a'
//     }
//   ]
// ];

// const getRandomSetIndex = (excludeIndex) => {
//   let idx;
//   do {
//     idx = Math.floor(Math.random() * questionSets.length);
//   } while (idx === excludeIndex);
//   return idx;
// };

// const Quiz = () => {
//   const { courseId,mo_id  } = useParams();
//   console.log("from sarvaa",courseId,mo_id)

//   const [currentSetIndex, setCurrentSetIndex] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [showResults, setShowResults] = useState(false);

//   const questions = questionSets[currentSetIndex];

//   const handleAnswerSelect = (questionId, optionId) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [questionId]: optionId
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     setShowResults(true);
//     const score = calculateScore();
//     const passed = score / questions.length >= 0.5;

//     // Get auth token
//     const token = localStorage.getItem('authToken') || localStorage.getItem('token');
//     const userEmail = email; // from localStorage
//     const courseName = 'ISP Basics'; // or dynamic course/module name
//     const m_id = 'lesson1'; // or dynamic module/lesson ID
//     const completedAt = new Date().toISOString();

//     try {
//       // Submit quiz progress to new endpoint
//       const response = await fetch("http://localhost:5000/api/progress/submit-quiz", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           userEmail,
//           courseName,
//           completedModules: [{ m_id, completedAt }],
//           lastAccessedModule: m_id
//         }),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         console.log('Quiz progress saved:', result);
//         // Update local storage for backward compatibility
//         if (passed) {
//           let currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
//           const updatedLevel = currentLevel + 1;
//           localStorage.setItem("levelCleared", updatedLevel);
//         }
//       } else {
//         const errorData = await response.json();
//         console.error('Failed to save quiz progress', errorData);
//       }
//     } catch (error) {
//       console.error('Error saving quiz progress:', error);
//     }
//   };

//   const calculateScore = () => {
//     let correct = 0;
//     questions.forEach(question => {
//       if (selectedAnswers[question.id] === question.correctAnswer) {
//         correct++;
//       }
//     });
//     return correct;
//   };

//   const resetQuiz = () => {
//     const newSetIndex = getRandomSetIndex(currentSetIndex);
//     setCurrentSetIndex(newSetIndex);
//     setCurrentQuestion(0);
//     setSelectedAnswers({});
//     setShowResults(false);
//   };

//   if (showResults) {
//     const score = calculateScore();
//     const percentage = (score / questions.length) * 100;
//     const isPassed = percentage >= 50;
// // Inside your Quiz component file, just before `return` or within the component


//     return (
//       <div className="results-container">
//         <div className="results-card">
//           <h1 className="results-title">Quiz Results</h1>
//           <div className="score-display">
//             <div className="score-number">{score}/{questions.length}</div>
//             <div className="score-percentage">Score: {percentage.toFixed(1)}%</div>
//             <div className="score-message">
//               {percentage >= 80
//                 ? "Excellent! You have a great understanding of ISPs!"
//                 : percentage >= 60
//                 ? "Good job! You have a solid foundation about ISPs."
//                 : percentage >= 40
//                 ? "Not bad! Consider reviewing ISP concepts."
//                 : "Keep learning! ISPs are an important topic to understand."}
//             </div>
//           </div>

//           <div className="questions-review">
//             {questions.map((question, index) => (
//               <div key={question.id} className="question-review">
//                 <div className="question-review-title">
//                   Question {index + 1}: {question.question}
//                 </div>
//                 <div className="question-review-content">
//                   <div className="question-review-answer">
//                     Your answer: {selectedAnswers[question.id]
//                       ? question.options.find(opt => opt.id === selectedAnswers[question.id])?.text
//                       : "Not answered"}
//                   </div>
//                   <div className={`answer-status ${
//                     selectedAnswers[question.id] === question.correctAnswer
//                       ? 'correct'
//                       : 'incorrect'
//                   }`}>
//                     {selectedAnswers[question.id] === question.correctAnswer ? '✓' : '✗'}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {!isPassed ? (
//             <button onClick={resetQuiz} className="retake-button">Retake Quiz</button>
//           ) : (
//             <button onClick={() => window.location.href = '/lesson2'} className="next-course-button">
//               Start Next Course
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const currentQuestionData = questions[currentQuestion];
//   const isLastQuestion = currentQuestion === questions.length - 1;

//   return (
//     <div className="quiz-container">
//       <div className="quiz-card">
//         <div className="quiz-header">
//           <h2 className="question-number">QUESTION {currentQuestion + 1}</h2>
//           <h1 className="question-text">{currentQuestionData.question}</h1>
//         </div>

//         <div className="options-container">
//           {currentQuestionData.options.map((option) => (
//             <button
//               key={option.id}
//               onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
//               className={`option-button ${
//                 selectedAnswers[currentQuestionData.id] === option.id ? 'selected' : ''
//               }`}
//             >
//               {option.id}) {option.text}
//             </button>
//           ))}
//         </div>

//         <div className="navigation-container">
//           <button
//             onClick={handlePrevious}
//             disabled={currentQuestion === 0}
//             className={`nav-button${currentQuestion === 0 ? '' : ' primary'}`}
//           >
//             Previous
//           </button>

//           <div className="progress-indicators">
//             {questions.map((_, index) => (
//               <div
//                 key={index}
//                 className={`progress-dot ${
//                   index === currentQuestion
//                     ? 'current'
//                     : index < currentQuestion
//                     ? 'completed'
//                     : 'upcoming'
//                 }`}
//               />
//             ))}
//           </div>

//           {isLastQuestion ? (
//             <button onClick={handleSubmit} className="nav-button submit">SUBMIT</button>
//           ) : (
//             <button onClick={handleNext} className="nav-button primary">Next</button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Quiz;



import React, { useState, useEffect } from 'react';
import './quiz.css';
import { useParams, useNavigate } from 'react-router-dom';

const email = localStorage.getItem("employeeEmail"); // stored at login
const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
const thisLesson = 4; // Set this based on current lesson

// Update level in localStorage and backend if eligible
if (thisLesson === currentLevel + 1) {
  const updatedLevel = thisLesson;
  localStorage.setItem("levelCleared", updatedLevel);

  fetch("http://localhost:5000/api/update-progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, levelCount: updatedLevel }),
  });
}

const Quiz = () => {
  const { courseId, mo_id } = useParams();
  //console.log("from sarvaa", courseId, mo_id);

  // State management
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  // Fetch questions from backend
  const fetchQuestions = async (attempt) => {
    try {
      setLoading(true);
      setError(null);

      console.log("question incoming.......................")

      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch("http://localhost:5000/api/courses/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          courseId: courseId,
          moduleId: mo_id,      
          attemptNumber: attempt
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched questions for attempt jibcuiewbqciwbqic", attempt, ":", data);

      // Transform backend data to match our component structure
      const transformedQuestions = data.map((question, index) => {
        // Find the index of the correct answer in the options array
        let correctAnswerId = null;
        if (typeof question.correctAnswer === 'string' && Array.isArray(question.options)) {
          const idx = question.options.findIndex(opt => opt === question.correctAnswer);
          if (idx !== -1) {
            correctAnswerId = String.fromCharCode(97 + idx); // 'a', 'b', ...
          }
        }
        return {
          id: question._id || question.id || index + 1,
          question: question.question,
          options: question.options.map((option, optIndex) => ({
            id: String.fromCharCode(97 + optIndex),
            text: option
          })),
          correctAnswer: correctAnswerId // always 'a', 'b', etc.
        };
      });

      
      console.log("the transformed questions",transformedQuestions)

      setQuestions(transformedQuestions);
      setLoading(false);

    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch questions on component mount
  useEffect(() => {
    if (courseId && mo_id) {
      fetchQuestions(attemptNumber); // Start with first attempt (5 questions)
    }
  }, [courseId, mo_id]);

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 50;

    // Always show results first
    setShowResults(true);

    // If first attempt and didn't pass, prepare for retake
    if (!passed && attemptNumber === 1 && !hasFailedOnce) {
      setHasFailedOnce(true);
      // Don't increment attemptNumber here - wait for retake button click
    }

    // Get auth token
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const userEmail = email;
    const courseName = 'isp basics '; // You might want to make this dynamic yvubwinvwruihcfw9fu9w hf9hw8ft98fun8ywg f9wryfy7ewgf0igwufuryf 9ewfyuewrg f 9fwf98uweruofg w90fgewfh wer
    const m_id = mo_id;
    const completedAt = new Date().toISOString();

  //   try {
  //     // Submit quiz progress to backend
  //     const response = await fetch("http://localhost:5000/api/progress/submit-quiz", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         userEmail,
  //         courseName,
  //         completedModules: [{ m_id, completedAt }],
  //         lastAccessedModule: m_id
  //       }),
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log('Quiz progress saved:', result);
  //       // Update local storage for backward compatibility
  //       if (passed) {
  //         let currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
  //         const updatedLevel = currentLevel + 1;
  //         localStorage.setItem("levelCleared", updatedLevel);
  //       }
  //     } else {
  //       const errorData = await response.json();
  //       console.error('Failed to save quiz progress', errorData);
  //     }
  //   } catch (error) {
  //     console.error('Error saving quiz progress:', error);
  //   }
   };

   const getNextMoId = (mo_id) => {
    const match = mo_id.match(/^(\D+)(\d+)$/);
    if (!match) return null;
  
    const [ , prefix, numberPart ] = match;
    const next = (parseInt(numberPart) + 1).toString().padStart(numberPart.length, '0');
    return `${prefix}${next}`;
  };

  // Handle retake quiz button click
  const handleRetakeQuiz = async () => {
    try {
      // Reset quiz state
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      
      // Increment attempt number for next set of questions
      const nextAttempt = attemptNumber + 1;
      setAttemptNumber(nextAttempt);
      
      // Fetch new questions for the next attempt
      await fetchQuestions(nextAttempt);
      
    } catch (error) {
      console.error('Error during retake:', error);
      setError('Failed to load retake questions. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            <h2>Loading Quiz...</h2>
            <p>Please wait while we fetch your questions.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            <h2>Error Loading Quiz</h2>
            <p>Failed to load questions: {error}</p>
            <button onClick={() => fetchQuestions(attemptNumber)} className="nav-button primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No questions available
  if (!questions.length) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="quiz-header">
            <h2>No Questions Available</h2>
            <p>No questions found for this course and module.</p>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const score = calculateScore();
    const totalQuestions = questions.length;
    const isPassed = score >= 3; // 3/5 or more is pass

    return (
      <div className="results-container">
        <div className="results-card">
          <h1 className="results-title">Quiz Results</h1>
          <div className="score-display">
            <div className="score-number">{score}/{totalQuestions}</div>
            <div className="score-message">
              {isPassed
                ? "Congratulations! You passed the quiz."
                : "You did not pass. You can retake with new questions."}
            </div>
          </div>
          <div className="questions-review">
            {questions.map((question, index) => (
              <div key={question.id} className="question-review">
                <div className="question-review-title">
                  Question {index + 1}: {question.question}
                </div>
                <div className="question-review-content">
                  <div className="question-review-answer">
                    Your answer: {selectedAnswers[question.id]
                      ? question.options.find(opt => opt.id === selectedAnswers[question.id])?.text
                      : "Not answered"}
                  </div>
                  <div className={`answer-status ${
                    selectedAnswers[question.id] === question.correctAnswer
                      ? 'correct'
                      : 'incorrect'
                  }`}>
                    {selectedAnswers[question.id] === question.correctAnswer ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Show Retake button only if failed and haven't exceeded attempts */}
          {!isPassed && hasFailedOnce && attemptNumber < 2 && (
            <button onClick={handleRetakeQuiz} className="retake-button">
              Retake Quiz
            </button>
          )}
          {/* Show message if exceeded attempts */}
          {!isPassed && attemptNumber >= 2 && (
            <div className="attempt-limit-message">
              You need to try after 1 day as your attempts are over.
            </div>
          )}
          {isPassed && (
            // <button onClick={() => window.location.href = '/quiz/${courseId}/${mo_id}'} className="next-course-button">
            //   Start Next Course
            // </button>

            <button
              onClick={() => {
                const nextMoId = getNextMoId(mo_id);
                if (!nextMoId) {
                  alert("Invalid mo_id format");
                  return;
                }
                window.location.href =` /course/${courseId}/lesson/${nextMoId}`;
              }}
              className="next-course-button"
            >
              Start Next Course
            </button>

            
          )}
        </div>
      </div>
    );
  }

  // Quiz view
  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="question-number">QUESTION {currentQuestion + 1}</h2>
          <h1 className="question-text">{currentQuestionData.question}</h1>
          {attemptNumber > 1 && (
            <div className="attempt-indicator">
              Retake Attempt {attemptNumber} - Different Questions
            </div>
          )}
        </div>

        <div className="options-container">
          {currentQuestionData.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
              className={`option-button ${
                selectedAnswers[currentQuestionData.id] === option.id ? 'selected' : ''
              }`}
            >
              {option.id}) {option.text}
            </button>
          ))}
        </div>

        <div className="navigation-container">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`nav-button${currentQuestion === 0 ? '' : ' primary'}`}
          >
            Previous
          </button>

          <div className="progress-indicators">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${
                  index === currentQuestion
                    ? 'current'
                    : index < currentQuestion
                    ? 'completed'
                    : 'upcoming'
                }`}
              />
            ))}
          </div>

          {isLastQuestion ? (
            <button onClick={handleSubmit} className="nav-button submit">SUBMIT</button>
          ) : (
            <button onClick={handleNext} className="nav-button primary">Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;