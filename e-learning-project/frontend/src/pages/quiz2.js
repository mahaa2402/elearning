import React, { useState } from 'react';
import './quiz.css';

const email = localStorage.getItem("employeeEmail"); // stored at login
const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
const thisLesson = 2; // Set this based on current lesson

const questions = [
  {
 id: 1,
    question: "Which of the following best defines an ISP?",
    options: [
      { id: 'a', text: 'A company that sells antivirus software' },
      { id: 'b', text: 'A service that provides access to the internet' },
      { id: 'c', text: 'A device used to connect LAN cables' },
      { id: 'd', text: 'A protocol for securing email communication' },
      { id: 'e', text: 'A type of network router' }
    ],
    correctAnswer: 'b'
  },
  {
    id: 2,
    question: "Which of the following is a Tier 1 ISP characteristic?",
    options: [
      { id: 'a', text: 'Connects directly to other Tier 1 networks without paying for transit' },
      { id: 'b', text: 'Provides only local internet access' },
      { id: 'c', text: 'Offers free internet services' },
      { id: 'd', text: 'Only serves residential customers' },
      { id: 'e', text: 'Operates only in one country' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 3,
    question: "What type of internet connection uses existing telephone lines?",
    options: [
      { id: 'a', text: 'Fiber optic' },
      { id: 'b', text: 'Cable' },
      { id: 'c', text: 'DSL (Digital Subscriber Line)' },
      { id: 'd', text: 'Satellite' },
      { id: 'e', text: 'Wireless' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 4,
    question: "Which internet technology provides the fastest and most reliable connection?",
    options: [
      { id: 'a', text: 'Dial-up' },
      { id: 'b', text: 'DSL' },
      { id: 'c', text: 'Cable' },
      { id: 'd', text: 'Fiber optic' },
      { id: 'e', text: 'Satellite' }
    ],
    correctAnswer: 'd'
  },
  {
    id: 5,
    question: "What is the primary security responsibility of ISPs?",
    options: [
      { id: 'a', text: 'Providing free antivirus software' },
      { id: 'b', text: 'Protecting network infrastructure from cyber attacks' },
      { id: 'c', text: 'Monitoring all user activities' },
      { id: 'd', text: 'Blocking all social media sites' },
      { id: 'e', text: 'Providing unlimited bandwidth' }
    ],
    correctAnswer: 'b'
  }
];

const QuizLesson2 = () => {
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
    const m_id = 'lesson2'; // or dynamic module/lesson ID
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
          localStorage.setItem('quiz2Passed', 'true');
          let currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
          const updatedLevel = Math.max(currentLevel, 2);
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
              {isPassed ? 'Congratulations! You passed the ISP Quiz!' : 'Please try again to pass the quiz.'}
            </div>
          </div>
          {!isPassed ? (
            <button onClick={resetQuiz} className="retake-button">Retake Quiz</button>
          ) : (
            <button onClick={() => window.location.href = '/lesson3'} className="next-course-button">Start Next Course</button>
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

export default QuizLesson2;