

// Dashboard.js
import React, { useState, useEffect } from 'react';
import Quizzes from './Quizzes';
import './dashboard.css';

const Dashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/quizzes');
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

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
        <Quizzes quizzes={quizzes} />
      </div>
    </div>
  );
};

export default Dashboard;
