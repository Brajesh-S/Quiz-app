
import React from 'react';
import './QuestionSidebar.css';

const QuestionSidebar = ({ questions, selectedAnswers, currentQuestionIndex }) => {
  return (
    <div className="question-sidebar">
      {questions.map((question, index) => (
        <div key={question.id} className={`sidebar-question-item ${index === currentQuestionIndex ? 'current' : ''}`}>
          <span className="question-number">{index + 1}</span>
          <span className="question-type">Mcq</span>
          <span className={`question-status ${selectedAnswers[question.id] ? "answered" : "unanswered"}`}>
            {selectedAnswers[question.id] ? "●" : "○"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default QuestionSidebar;
