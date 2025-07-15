import React, { useState } from 'react';
import './quiz.css';

const email = localStorage.getItem("employeeEmail"); // stored at login
const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
const thisLesson = 4; // Set this based on current lesson

const questions = [
  {
    id: 1,
    question: "Which of the following is considered sensitive information?",
    options: [
      { id: 'a', text: 'Credit card number' },
      { id: 'b', text: 'Medical records' },
      { id: 'c', text: 'Social Security Number' },
      { id: 'd', text: 'All of the above' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'd'
  },
  {
    id: 2,
    question: "What is the best way to dispose of sensitive paper documents?",
    options: [
      { id: 'a', text: 'Throw them in the trash' },
      { id: 'b', text: 'Shred them' },
      { id: 'c', text: 'Burn them in public' },
      { id: 'd', text: 'Recycle without shredding' },
      { id: 'e', text: 'Keep them forever' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 3,
    question: "If you receive an email asking for your password, what should you do?",
    options: [
      { id: 'a', text: 'Reply with your password' },
      { id: 'b', text: 'Ignore or report the email as phishing' },
      { id: 'c', text: 'Forward it to friends' },
      { id: 'd', text: 'Click all links in the email' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 4,
    question: "Which regulation protects sensitive information in the EU?",
    options: [
      { id: 'a', text: 'GDPR' },
      { id: 'b', text: 'HIPAA' },
      { id: 'c', text: 'FERPA' },
      { id: 'd', text: 'SOX' },
      { id: 'e', text: 'PCI DSS' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 5,
    question: "What should you do if you suspect a data breach?",
    options: [
      { id: 'a', text: 'Ignore it' },
      { id: 'b', text: 'Report it to the appropriate authority' },
      { id: 'c', text: 'Delete all files' },
      { id: 'd', text: 'Tell your friends' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'b'
  }
];

const QuizLesson4 = () => {
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
  
  try {
    // Submit quiz progress to new endpoint
    const response = await fetch("http://localhost:5000/api/progress/submit-quiz", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        quizId: 4,
        quizName: "Data Protection Quiz",
        score: score,
        totalQuestions: questions.length,
        passed: passed
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
      console.error('Failed to save quiz progress');
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

export default QuizLesson4;
