import React from 'react';
import './dashboard.css';

const dashboard = () => {
  return (
    <div className="quiz-app">
      <div className="sidebar">
        <h1 className="logo">Øendo</h1>
        <div className="menu-item">
          <span className="icon">⊞</span>
          Tests
        </div>
      </div>
      <div className="main-content">
        <h2>Quizzes for you!</h2>
        <div className="quiz-card">
          <h3>Cybermind O Mania</h3>
          <div className="quiz-details">
            <span>Total Questions 20</span>
            <span>Total points 100</span>
          </div>
          <button className="solve-btn yellow">Solve Challenge</button>
        </div>
        <div className="quiz-card">
          <h3>Cybermind O Mania</h3>
          <div className="quiz-details">
            <span>Total Questions 20</span>
            <span>Total points 100</span>
          </div>
          <button className="solve-btn white">Solve Challenge</button>
        </div>
      </div>
    </div>
  );
};

export default dashboard;