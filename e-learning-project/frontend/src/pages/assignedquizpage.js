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
      <div className="aqp-assigned-quiz-page">
        <div className="aqp-loading-container">
          <div className="aqp-loading-spinner"></div>
          <p className="aqp-loading-text">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aqp-assigned-quiz-page">
        <div className="aqp-error-state">
          <AlertCircle className="aqp-error-icon" />
          <p className="aqp-error-text">Error: {error}</p>
          <button className="aqp-btn aqp-btn-back" onClick={() => navigate(-1)}>Back to Module</button>
        </div>
      </div>
    );
  }

  if (quizSubmitted) {
    return (
      <div className="aqp-assigned-quiz-page">
        <header className="aqp-quiz-header">
          <button className="aqp-back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft className="aqp-back-icon" />
            Back to Module
          </button>
          <div className="aqp-quiz-title-section">
            <h1 className="aqp-quiz-title">{selectedModule?.title || 'Module'} - Quiz Results</h1>
          </div>
        </header>

        <main className="aqp-quiz-content">
          <div className="aqp-quiz-results-container">
            <div className="aqp-results-card">
              <div className="aqp-results-header">
                <FileText className="aqp-results-icon" />
                <h2 className="aqp-results-title">Quiz Completed!</h2>
              </div>
              
              <div className="aqp-score-section">
                <div className="aqp-score-circle">
                  <span className="aqp-score-number">{getQuizScore()}%</span>
                </div>
                <p className="aqp-score-label">Your Score</p>
              </div>

              <div className="aqp-stats-section">
                <div className="aqp-stat-item">
                  <span className="aqp-stat-label">Total Questions:</span>
                  <span className="aqp-stat-value">{currentQuiz?.questions?.length || 0}</span>
                </div>
                <div className="aqp-stat-item">
                  <span className="aqp-stat-label">Correct Answers:</span>
                  <span className="aqp-stat-value">
                    {currentQuiz?.questions?.filter((_, index) => 
                      quizAnswers[index] === currentQuiz.questions[index].correctAnswer
                    ).length || 0}
                  </span>
                </div>
                <div className="aqp-stat-item">
                  <span className="aqp-stat-label">Passing Score:</span>
                  <span className="aqp-stat-value">{currentQuiz?.passingScore || 70}%</span>
                </div>
              </div>

              <div className={`aqp-pass-status ${getQuizScore() >= (currentQuiz?.passingScore || 70) ? 'aqp-passed' : 'aqp-failed'}`}>
                {getQuizScore() >= (currentQuiz?.passingScore || 70) ? (
                  <>
                    <CheckCircle className="aqp-status-icon" />
                    <span>Congratulations! You passed the quiz!</span>
                  </>
                ) : (
                  <>
                    <Circle className="aqp-status-icon" />
                    <span>You need to score {(currentQuiz?.passingScore || 70)}% to pass. Try again!</span>
                  </>
                )}
              </div>

              <div className="aqp-action-buttons">
                <button 
                  className="aqp-btn aqp-btn-retry"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setCurrentQuestionIndex(0);
                  }}
                >
                  Retry Quiz
                </button>
                <button 
                  className="aqp-btn aqp-btn-back-to-module"
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
    <div className="aqp-assigned-quiz-page">
      <header className="aqp-quiz-header">
        <button className="aqp-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft className="aqp-back-icon" />
          Back to Module
        </button>
        <div className="aqp-quiz-title-section">
          <h1 className="aqp-quiz-title">{selectedModule?.title || 'Module'} - Quiz</h1>
          <p className="aqp-quiz-subtitle">Question {currentQuestionIndex + 1} of {currentQuiz?.questions?.length || 0}</p>
        </div>
      </header>

      <main className="aqp-quiz-content">
        {/* Progress Bar */}
        <div className="aqp-progress-section">
          <div className="aqp-progress-bar">
            <div 
              className="aqp-progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="aqp-progress-text">
            {currentQuestionIndex + 1} / {currentQuiz?.questions?.length || 0}
          </span>
        </div>

        {/* Question Card */}
        <div className="aqp-question-container">
          <div className="aqp-question-card">
            <div className="aqp-question-header">
              <h2 className="aqp-question-title">
                {currentQuestion?.question || 'Question not available'}
              </h2>
            </div>

            <div className="aqp-options-container">
              {currentQuestion?.options?.map((option, optionIndex) => (
                <label 
                  key={optionIndex} 
                  className={`aqp-option-label ${
                    quizAnswers[currentQuestionIndex] === option ? 'aqp-selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={quizAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerSelect(option)}
                    className="aqp-option-input"
                  />
                  <span className="aqp-option-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="aqp-navigation-section">
          <button 
            className="aqp-btn aqp-btn-previous"
            onClick={handlePreviousQuestion}
            disabled={isFirstQuestion()}
          >
            <ChevronLeft className="aqp-nav-icon" />
            Previous
          </button>

          <div className="aqp-question-indicators">
            {currentQuiz?.questions?.map((_, index) => (
              <button
                key={index}
                className={`aqp-indicator ${isQuestionAnswered(index) ? 'aqp-answered' : ''} ${
                  index === currentQuestionIndex ? 'aqp-current' : ''
                }`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {isLastQuestion() ? (
            <button 
              className="aqp-btn aqp-btn-submit"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(quizAnswers).length < currentQuiz?.questions?.length}
            >
              Submit Quiz
            </button>
          ) : (
            <button 
              className="aqp-btn aqp-btn-next"
              onClick={handleNextQuestion}
              disabled={!quizAnswers[currentQuestionIndex]}
            >
              Next
              <ChevronRight className="aqp-nav-icon" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default AssignedQuizPage;