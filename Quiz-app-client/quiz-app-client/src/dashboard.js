

// Dashboard.js
import React from 'react';
import Quizzes from './Quizzes';
import './dashboard.css';

const Dashboard = () => {
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
      <Quizzes />
    </div>
  </div>
  );
};

export default Dashboard;
