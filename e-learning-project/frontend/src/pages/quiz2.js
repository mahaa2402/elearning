import React, { useState } from 'react';
import './quiz.css';

const questions = [
  {
    id: 1,
    question: "What does ISP stand for?",
    options: [
      { id: 'a', text: 'Internet Service Provider' },
      { id: 'b', text: 'Internal Security Policy' },
      { id: 'c', text: 'International Service Protocol' },
      { id: 'd', text: 'Internet Secure Provider' },
      { id: 'e', text: 'Information Security Provider' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 2,
    question: "Which of the following is NOT a type of ISP connection?",
    options: [
      { id: 'a', text: 'Dial-up' },
      { id: 'b', text: 'Broadband' },
      { id: 'c', text: 'Fiber Optic' },
      { id: 'd', text: 'Bluetooth' },
      { id: 'e', text: 'Satellite' }
    ],
    correctAnswer: 'd'
  },
  {
    id: 3,
    question: "What is a primary responsibility of an ISP?",
    options: [
      { id: 'a', text: 'Provide internet access' },
      { id: 'b', text: 'Sell computers' },
      { id: 'c', text: 'Manufacture routers' },
      { id: 'd', text: 'Develop operating systems' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 4,
    question: "Which technology offers the fastest internet speeds?",
    options: [
      { id: 'a', text: 'Dial-up' },
      { id: 'b', text: 'DSL' },
      { id: 'c', text: 'Cable' },
      { id: 'd', text: 'Fiber Optic' },
      { id: 'e', text: 'Satellite' }
    ],
    correctAnswer: 'd'
  },
  {
    id: 5,
    question: "What security service might an ISP offer?",
    options: [
      { id: 'a', text: 'Antivirus software' },
      { id: 'b', text: 'Spam filtering' },
      { id: 'c', text: 'Parental controls' },
      { id: 'd', text: 'All of the above' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'd'
  }
];

const alternateQuestions = [
  {
    id: 1,
    question: "Which of the following is a Tier 1 ISP responsibility?",
    options: [
      { id: 'a', text: 'Providing backbone internet connectivity' },
      { id: 'b', text: 'Selling mobile phones' },
      { id: 'c', text: 'Developing web browsers' },
      { id: 'd', text: 'Manufacturing modems' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 2,
    question: "Which technology is considered obsolete for internet access?",
    options: [
      { id: 'a', text: 'Fiber Optic' },
      { id: 'b', text: 'Cable' },
      { id: 'c', text: 'Dial-up' },
      { id: 'd', text: 'DSL' },
      { id: 'e', text: 'Satellite' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 3,
    question: "What is a common bundled service with cable internet?",
    options: [
      { id: 'a', text: 'TV and phone' },
      { id: 'b', text: 'Cloud storage' },
      { id: 'c', text: 'Mobile apps' },
      { id: 'd', text: 'Smart watches' },
      { id: 'e', text: 'None of the above' }
    ],
    correctAnswer: 'a'
  },
  {
    id: 4,
    question: "Which is NOT a security responsibility of an ISP?",
    options: [
      { id: 'a', text: 'Preventing DDoS attacks' },
      { id: 'b', text: 'Protecting customer data' },
      { id: 'c', text: 'Selling groceries' },
      { id: 'd', text: 'Offering parental controls' },
      { id: 'e', text: 'Spam filtering' }
    ],
    correctAnswer: 'c'
  },
  {
    id: 5,
    question: "What is the fastest type of internet connection?",
    options: [
      { id: 'a', text: 'DSL' },
      { id: 'b', text: 'Cable' },
      { id: 'c', text: 'Fiber Optic' },
      { id: 'd', text: 'Dial-up' },
      { id: 'e', text: 'Satellite' }
    ],
    correctAnswer: 'c'
  }
];

const QuizLesson2 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  // Use alternate questions if retake flag is set
  const isRetake = localStorage.getItem('quiz2Retake') === 'true';
  const questionSet = isRetake ? alternateQuestions : questions;

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentQuestion < questionSet.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const passed = calculateScore() / questionSet.length >= 0.5;
    localStorage.setItem('quiz2Passed', passed ? 'true' : 'false');
    if (!passed) {
      localStorage.setItem('quiz2Retake', 'true');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questionSet.forEach(q => {
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
    const percentage = (score / questionSet.length) * 100;
    const isPassed = percentage >= 50;
    return (
      <div className="results-container">
        <div className="results-card">
          <h1 className="results-title">Quiz Results</h1>
          <div className="score-display">
            <div className="score-number">{score}/{questionSet.length}</div>
            <div className="score-percentage">Score: {percentage.toFixed(1)}%</div>
            <div className="score-message">
              {isPassed ? 'Congratulations! You passed.' : 'Please try again.'}
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

  const currentQuestionData = questionSet[currentQuestion];
  const isLastQuestion = currentQuestion === questionSet.length - 1;

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
