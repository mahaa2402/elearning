import React, { useState, useEffect } from 'react';
import './quiz.css';

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

const questionSets = [
  [
    // Set 1
    {
      id: 1,
      question: "What is the goal of data protection?",
      options: [
        { id: 'a', text: 'Information Security Policy' },
        { id: 'b', text: 'Information Secure Policy' },
        { id: 'c', text: 'Information Social Policy' },
        { id: 'd', text: 'Intro Security Policy' },
        { id: 'e', text: 'Information Security Policy' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 2,
      question: "What does ISP stand for?",
      options: [
        { id: 'a', text: 'Information Security Policy' },
        { id: 'b', text: 'Information Secure Policy' },
        { id: 'c', text: 'Internet Service Provider' },
        { id: 'd', text: 'Intro Security Policy' },
        { id: 'e', text: 'Information System Protocol' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 3,
      question: "Which of the following is a primary service offered by ISPs?",
      options: [
        { id: 'a', text: 'Internet Access' },
        { id: 'b', text: 'Email Services' },
        { id: 'c', text: 'Web Hosting' },
        { id: 'd', text: 'Domain Registration' },
        { id: 'e', text: 'All of the above' }
      ],
      correctAnswer: 'e'
    },
    {
      id: 4,
      question: "What is the most common type of internet connection provided by ISPs to residential customers?",
      options: [
        { id: 'a', text: 'Dial-up Connection' },
        { id: 'b', text: 'Broadband Connection' },
        { id: 'c', text: 'Satellite Connection' },
        { id: 'd', text: 'Fiber Optic Connection' },
        { id: 'e', text: 'DSL Connection' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 5,
      question: "Which regulation is most associated with data privacy in Europe?",
      options: [
        { id: 'a', text: 'HIPAA' },
        { id: 'b', text: 'GDPR' },
        { id: 'c', text: 'FERPA' },
        { id: 'd', text: 'SOX' },
        { id: 'e', text: 'PCI DSS' }
      ],
      correctAnswer: 'b'
    }
  ],
  [
    // Set 2
    {
      id: 1,
      question: "Which of the following is NOT a type of ISP?",
      options: [
        { id: 'a', text: 'Dial-up' },
        { id: 'b', text: 'Broadband' },
        { id: 'c', text: 'Satellite' },
        { id: 'd', text: 'Fiber Optic' },
        { id: 'e', text: 'Bluetooth' }
      ],
      correctAnswer: 'e'
    },
    {
      id: 2,
      question: "What does GDPR stand for?",
      options: [
        { id: 'a', text: 'General Data Protection Regulation' },
        { id: 'b', text: 'Global Data Privacy Regulation' },
        { id: 'c', text: 'Government Data Policy Regulation' },
        { id: 'd', text: 'General Data Privacy Rules' },
        { id: 'e', text: 'Global Data Protection Rules' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 3,
      question: "Which is a secure way to protect your online accounts?",
      options: [
        { id: 'a', text: 'Use strong, unique passwords' },
        { id: 'b', text: 'Share passwords with friends' },
        { id: 'c', text: 'Use the same password everywhere' },
        { id: 'd', text: 'Write passwords on sticky notes' },
        { id: 'e', text: 'None of the above' }
      ],
      correctAnswer: 'a'
    },
    {
      id: 4,
      question: "Which of these is a benefit of broadband over dial-up?",
      options: [
        { id: 'a', text: 'Faster speeds' },
        { id: 'b', text: 'Always on connection' },
        { id: 'c', text: 'Can use phone and internet at same time' },
        { id: 'd', text: 'All of the above' },
        { id: 'e', text: 'None of the above' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 5,
      question: "What is phishing?",
      options: [
        { id: 'a', text: 'A type of cyber attack' },
        { id: 'b', text: 'A way to catch fish' },
        { id: 'c', text: 'A type of broadband' },
        { id: 'd', text: 'A secure password' },
        { id: 'e', text: 'None of the above' }
      ],
      correctAnswer: 'a'
    }
  ],
  [
    // Set 3
    {
      id: 1,
      question: "Which of these is NOT a broadband technology?",
      options: [
        { id: 'a', text: 'DSL' },
        { id: 'b', text: 'Cable' },
        { id: 'c', text: 'Fiber Optic' },
        { id: 'd', text: 'Dial-up' },
        { id: 'e', text: 'Satellite' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 2,
      question: "What is the main purpose of a firewall?",
      options: [
        { id: 'a', text: 'To heat your house' },
        { id: 'b', text: 'To block unauthorized access' },
        { id: 'c', text: 'To provide internet' },
        { id: 'd', text: 'To store data' },
        { id: 'e', text: 'To clean viruses' }
      ],
      correctAnswer: 'b'
    },
    {
      id: 3,
      question: "Which of these is a strong password?",
      options: [
        { id: 'a', text: 'password123' },
        { id: 'b', text: 'qwerty' },
        { id: 'c', text: 'MyDog$2025!' },
        { id: 'd', text: '123456' },
        { id: 'e', text: 'abcde' }
      ],
      correctAnswer: 'c'
    },
    {
      id: 4,
      question: "Which of these is a responsibility of an ISP?",
      options: [
        { id: 'a', text: 'Provide internet access' },
        { id: 'b', text: 'Protect user privacy' },
        { id: 'c', text: 'Maintain network infrastructure' },
        { id: 'd', text: 'All of the above' },
        { id: 'e', text: 'None of the above' }
      ],
      correctAnswer: 'd'
    },
    {
      id: 5,
      question: "What is malware?",
      options: [
        { id: 'a', text: 'A type of software designed to harm computers' },
        { id: 'b', text: 'A type of hardware' },
        { id: 'c', text: 'A secure password' },
        { id: 'd', text: 'A type of broadband' },
        { id: 'e', text: 'None of the above' }
      ],
      correctAnswer: 'a'
    }
  ]
];

const getRandomSetIndex = (excludeIndex) => {
  let idx;
  do {
    idx = Math.floor(Math.random() * questionSets.length);
  } while (idx === excludeIndex);
  return idx;
};

const Quiz = () => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const questions = questionSets[currentSetIndex];

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
        quizId: 1,
        quizName: "ISP Basics Quiz",
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
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    const newSetIndex = getRandomSetIndex(currentSetIndex);
    setCurrentSetIndex(newSetIndex);
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
              {percentage >= 80
                ? "Excellent! You have a great understanding of ISPs!"
                : percentage >= 60
                ? "Good job! You have a solid foundation about ISPs."
                : percentage >= 40
                ? "Not bad! Consider reviewing ISP concepts."
                : "Keep learning! ISPs are an important topic to understand."}
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

          {!isPassed ? (
            <button onClick={resetQuiz} className="retake-button">Retake Quiz</button>
          ) : (
            <button onClick={() => window.location.href = '/lesson2'} className="next-course-button">
              Start Next Course
            </button>
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
