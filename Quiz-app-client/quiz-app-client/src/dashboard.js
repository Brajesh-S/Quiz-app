// Dashboard.js
import React from "react";
import Quizzes from "./Quizzes";
import "./dashboard.css";

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
        <div className="header-div">Quizzes for you !</div>
        <div className="quizzes-container">
          <Quizzes />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
