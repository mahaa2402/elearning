import React, { useState } from 'react';
import './quiz.css';

const email = localStorage.getItem("employeeEmail"); // stored at login
const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
const thisLesson = 4; // Set this based on current lesson


const questions = [
  {
    id: 1,
    question: "What is the main purpose of GDPR?",
    options: [
      { id: 'a', text: 'To protect personal data and privacy' },
      { id: 'b', text: 'To regulate internet speed' },
      { id: 'c', text: 'To provide free Wi-Fi' },
      { id: 'd', text: 'To increase broadband access' },
      { id: 'e', text: 'To sell user data' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 2,
    question: "Which of the following is a right under GDPR?",
    options: [
      { id: 'a', text: 'Right to be forgotten' },
      { id: 'b', text: 'Right to free internet' },
      { id: 'c', text: 'Right to unlimited storage' },
      { id: 'd', text: 'Right to free software' },
      { id: 'e', text: 'Right to free hardware' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 3,
    question: "Who must comply with GDPR?",
    options: [
      { id: 'a', text: 'Only companies in the EU' },
      { id: 'b', text: 'Any company processing EU residents\' data' },
      { id: 'c', text: 'Only government agencies' },
      { id: 'd', text: 'Only ISPs' },
      { id: 'e', text: 'Only banks' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 4,
    question: "What is a Data Protection Officer (DPO) responsible for?",
    options: [
      { id: 'a', text: 'Ensuring GDPR compliance in an organization' },
      { id: 'b', text: 'Providing free internet' },
      { id: 'c', text: 'Selling user data' },
      { id: 'd', text: 'Developing operating systems' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 5,
    question: "Which region does GDPR primarily apply to?",
    options: [
      { id: 'a', text: 'United States' },
      { id: 'b', text: 'European Union' },
      { id: 'c', text: 'Asia' },
      { id: 'd', text: 'Africa' },
      { id: 'e', text: 'Australia' }
    ],
    correctAnswer: 'b'
  }
];

const QuizLesson3 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
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

const handleSubmit = async () => {
  setShowResults(true);
  const score = calculateScore();
  const passed = score / questions.length >= 0.5;

  // Get auth token
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  const userEmail = email; // from localStorage
  const courseName = 'ISP Basics'; // or dynamic course/module name
  const m_id = 'lesson3'; // or dynamic module/lesson ID
  const completedAt = new Date().toISOString();

  try {
    // Submit quiz progress to new endpoint
    const response = await fetch("http://localhost:5000/api/progress/submit-quiz", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        userEmail,
        courseName,
        completedModules: [{ m_id, completedAt }],
        lastAccessedModule: m_id
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Quiz progress saved:', result);
      // Update local storage for backward compatibility
      if (passed) {
        let currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
        const updatedLevel = currentLevel + 1;
        localStorage.setItem("levelCleared", updatedLevel);
      }
    } else {
      const errorData = await response.json();
      console.error('Failed to save quiz progress', errorData);
    }
  } catch (error) {
    console.error('Error saving quiz progress:', error);
  }
};



  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    const isPassed = percentage >= 50;
    return (
      <div className="results-container">
        <div className="results-card">
          <h1 className="results-title">Quiz Results</h1>
          <div className="score-display">
            <div className="score-number">{score}/{questions.length}</div>
            <div className="score-percentage">Score: {percentage.toFixed(1)}%</div>
            <div className="score-message">
              {isPassed ? 'Congratulations! You passed.' : 'Please try again.'}
            </div>
          </div>
          {!isPassed ? (
            <button onClick={resetQuiz} className="retake-button">Retake Quiz</button>
          ) : (
            <button onClick={() => window.location.href = '/lesson4'} className="next-course-button">Start Next Course</button>
          )}
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <h2 className="question-number">QUESTION {currentQuestion + 1}</h2>
          <h1 className="question-text">{currentQuestionData.question}</h1>
        </div>
        <div className="options-container">
          {currentQuestionData.options.map(option => (
            <button
              key={option.id}
              onClick={() => handleAnswerSelect(currentQuestionData.id, option.id)}
              className={`option-button ${selectedAnswers[currentQuestionData.id] === option.id ? 'selected' : ''}`}
            >
              {option.id}) {option.text}
            </button>
          ))}
        </div>
        <div className="navigation-container">
          <button onClick={handlePrevious} disabled={currentQuestion === 0} className={`nav-button${currentQuestion === 0 ? '' : ' primary'}`}>Previous</button>
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

export default QuizLesson3;
