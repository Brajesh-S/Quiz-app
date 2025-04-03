import React from 'react';
import './QuestionSidebar.css';

const QuestionSidebar = ({ 
  questions, 
  selectedAnswers, 
  currentQuestionIndex,
  setCurrentQuestionIndex,
  closeSidebar 
}) => {
  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div className="question-sidebar">
      <div className="sidebar-header">
        <h3>Questions Overview</h3>
        <button className="close-sidebar" onClick={closeSidebar}>x
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="sidebar-progress">
        <div className="progress-stats">
          <div className="stat-item">
            <div className="stat-count">{Object.keys(selectedAnswers).length}</div>
            <div className="stat-label">Answered</div>
          </div>
          <div className="stat-item">
            <div className="stat-count">{questions.length - Object.keys(selectedAnswers).length}</div>
            <div className="stat-label">Remaining</div>
          </div>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="questions-list">
        {questions.map((question, index) => (
          <div 
            key={question.id} 
            className={`sidebar-question-item ${index === currentQuestionIndex ? 'current' : ''} ${selectedAnswers[question.id] ? "answered" : "unanswered"}`}
            onClick={() => handleQuestionClick(index)}
          >
            <span className="question-number">{index + 1}</span>
            <span className="question-type">MCQ</span>
            <span className="question-status">
              {selectedAnswers[question.id] ? "●" : "○"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSidebar;