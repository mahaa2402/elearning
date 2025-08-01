// frontend/src/pages/assignedquizpage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle, Circle, FileText } from 'lucide-react';
import './assignedquizpage.css';

const AssignedQuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(state?.courseDetails || null);
  const [selectedModule, setSelectedModule] = useState(state?.selectedModule || null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseDetails && selectedModule && selectedModule.quiz) {
      setLoading(false);
      setCurrentQuiz(selectedModule.quiz);
    } else {
      setError('No quiz data available for this module.');
      setLoading(false);
    }
  }, [courseDetails, selectedModule]);

  const handleAnswerSelect = (answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Here you can add logic to save quiz results to backend
    console.log('Quiz submitted with answers:', quizAnswers);
  };

  const getQuizScore = () => {
    if (!currentQuiz || !currentQuiz.questions) return 0;
    
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / currentQuiz.questions.length) * 100);
  };

  const getCurrentQuestion = () => {
    if (!currentQuiz || !currentQuiz.questions) return null;
    return currentQuiz.questions[currentQuestionIndex];
  };

  const isQuestionAnswered = (questionIndex) => {
    return quizAnswers.hasOwnProperty(questionIndex);
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === currentQuiz?.questions?.length - 1;
  };

  const isFirstQuestion = () => {
    return currentQuestionIndex === 0;
  };

  const getProgressPercentage = () => {
    if (!currentQuiz || !currentQuiz.questions) return 0;
    return ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="assigned-quiz-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assigned-quiz-page">
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <p className="error-text">Error: {error}</p>
          <button className="btn btn-back" onClick={() => navigate(-1)}>Back to Module</button>
        </div>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <div className="assigned-quiz-page">
        <header className="quiz-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft className="back-icon" />
            Back to Module
          </button>
          <div className="quiz-title-section">
            <h1 className="quiz-title">{selectedModule?.title || 'Module'} - Quiz Results</h1>
          </div>
        </header>

        <main className="quiz-content">
          <div className="quiz-results-container">
            <div className="results-card">
              <div className="results-header">
                <FileText className="results-icon" />
                <h2 className="results-title">Quiz Completed!</h2>
              </div>
              
              <div className="score-section">
                <div className="score-circle">
                  <span className="score-number">{getQuizScore()}%</span>
                </div>
                <p className="score-label">Your Score</p>
              </div>

              <div className="stats-section">
                <div className="stat-item">
                  <span className="stat-label">Total Questions:</span>
                  <span className="stat-value">{currentQuiz?.questions?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Correct Answers:</span>
                  <span className="stat-value">
                    {currentQuiz?.questions?.filter((_, index) => 
                      quizAnswers[index] === currentQuiz.questions[index].correctAnswer
                    ).length || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Passing Score:</span>
                  <span className="stat-value">{currentQuiz?.passingScore || 70}%</span>
                </div>
              </div>

              <div className={`pass-status ${getQuizScore() >= (currentQuiz?.passingScore || 70) ? 'passed' : 'failed'}`}>
                {getQuizScore() >= (currentQuiz?.passingScore || 70) ? (
                  <>
                    <CheckCircle className="status-icon" />
                    <span>Congratulations! You passed the quiz!</span>
                  </>
                ) : (
                  <>
                    <Circle className="status-icon" />
                    <span>You need to score {(currentQuiz?.passingScore || 70)}% to pass. Try again!</span>
                  </>
                )}
              </div>

              <div className="action-buttons">
                <button 
                  className="btn btn-retry"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setCurrentQuestionIndex(0);
                  }}
                >
                  Retry Quiz
                </button>
                <button 
                  className="btn btn-back-to-module"
                  onClick={() => navigate(-1)}
                >
                  Back to Module
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="assigned-quiz-page">
      <header className="quiz-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft className="back-icon" />
          Back to Module
        </button>
        <div className="quiz-title-section">
          <h1 className="quiz-title">{selectedModule?.title || 'Module'} - Quiz</h1>
          <p className="quiz-subtitle">Question {currentQuestionIndex + 1} of {currentQuiz?.questions?.length || 0}</p>
        </div>
      </header>

      <main className="quiz-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {currentQuestionIndex + 1} / {currentQuiz?.questions?.length || 0}
          </span>
        </div>

        {/* Question Card */}
        <div className="question-container">
          <div className="question-card">
            <div className="question-header">
              <h2 className="question-title">
                {currentQuestion?.question || 'Question not available'}
              </h2>
            </div>

            <div className="options-container">
              {currentQuestion?.options?.map((option, optionIndex) => (
                <label 
                  key={optionIndex} 
                  className={`option-label ${
                    quizAnswers[currentQuestionIndex] === option ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={quizAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="option-input"
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-section">
          <button 
            className="btn btn-previous"
            onClick={handlePreviousQuestion}
            disabled={isFirstQuestion()}
          >
            <ChevronLeft className="nav-icon" />
            Previous
          </button>

          <div className="question-indicators">
            {currentQuiz?.questions?.map((_, index) => (
              <button
                key={index}
                className={`indicator ${isQuestionAnswered(index) ? 'answered' : ''} ${
                  index === currentQuestionIndex ? 'current' : ''
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion() ? (
            <button 
              className="btn btn-submit"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < currentQuiz?.questions?.length}
            >
              Submit Quiz
            </button>
          ) : (
            <button 
              className="btn btn-next"
              onClick={handleNextQuestion}
              disabled={!quizAnswers[currentQuestionIndex]}
            >
              Next
              <ChevronRight className="nav-icon" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignedQuizPage; 