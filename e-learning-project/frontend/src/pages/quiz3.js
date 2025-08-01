import React, { useState, useEffect } from 'react';
import './quiz.css';
import { useParams, useNavigate } from 'react-router-dom';

const email = localStorage.getItem("employeeEmail"); // stored at login
const currentLevel = parseInt(localStorage.getItem("levelCleared")) || 0;
const thisLesson = 3; // Set this based on current lesson

const QuizLesson3 = () => {
  const { courseId, mo_id } = useParams();

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
  const fetchQuestions = async (attempt = 1) => {
    try {
      setLoading(true);
      setError(null);

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
      console.log("Fetched questions for attempt", attempt, ":", data);

      // Transform backend data to match our component structure
      const transformedQuestions = data.map((question, index) => ({
        id: question._id || question.id || index + 1,
        question: question.question,
        options: question.options.map((option, optIndex) => ({
          id: String.fromCharCode(97 + optIndex), // 'a', 'b', 'c', etc.
          text: option
        })),
        correctAnswer: question.correctAnswer || String.fromCharCode(97 + question.options.findIndex(opt => opt === question.correctAnswer))
      }));

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
      fetchQuestions(1); // Start with first attempt (5 questions)
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

    // If first attempt and didn't pass, fetch second set of questions
    if (!passed && attemptNumber === 1 && !hasFailedOnce) {
      setHasFailedOnce(true);
      setAttemptNumber(2);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      await fetchQuestions(2); // Fetch remaining 5 questions
      return;
    }

    setShowResults(true);

    // Get auth token
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    const userEmail = email;
    const courseName = 'ISP Basics';
    const m_id = mo_id;
    const completedAt = new Date().toISOString();

    try {
      // Submit quiz progress to backend
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

  const resetQuiz = () => {
    // Reset to first attempt with 5 questions
    setAttemptNumber(1);
    setHasFailedOnce(false);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    fetchQuestions(1);
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
                ? "Excellent! You have a great understanding of the topic!"
                : percentage >= 60
                ? "Good job! You have a solid foundation."
                : percentage >= 40
                ? "Not bad! Consider reviewing the concepts."
                : "Keep learning! This is an important topic to understand."}
            </div>
            {hasFailedOnce && (
              <div className="attempt-info">
                This was your retake attempt with different questions.
              </div>
            )}
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
            <button onClick={() => window.location.href = '/lesson4'} className="next-course-button">
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
          {hasFailedOnce && (
            <div className="attempt-indicator">
              Retake Attempt - Different Questions
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

export default QuizLesson3;
