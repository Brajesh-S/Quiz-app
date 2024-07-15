import React from "react";
import "./resultPage.css";
import { useLocation } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const { totalQuestions, questionsAttended, correctAnswers } =
    location.state || {};

  if (
    totalQuestions === undefined ||
    questionsAttended === undefined ||
    correctAnswers === undefined
  ) {
    return <p>Loading...</p>;
  }

  return (
    <div className="result-page-container">
      <div className="result-page-header"></div>
      <div className="result-page-content">
        <h1 className="thank-you-title">Thanks you for taking the test</h1>
        <h2 className="report-title">Your Report</h2>
        <div className="result-cards">
          <div className="result-card">
            <h3>Questions Attended</h3>
            <div className="circle-chart orange">
              <span className="chart-value">{questionsAttended}</span>
            </div>
            <div className="result-details">
              <div className="detail-row">
                <span className="detail-label">Total Questions Attended</span>
                <span className="detail-value">{questionsAttended}</span>
              </div>
              <div className="detail-separator"></div>
              <div className="detail-row">
                <span className="detail-label">Total Questions Asked</span>
                <span className="detail-value">{totalQuestions}</span>
              </div>
            </div>
          </div>
          <div className="result-card">
            <h3>Correct Answers</h3>
            <div className="circle-chart green">
              <span className="chart-value">{correctAnswers}</span>
            </div>
            <div className="result-details">
              <div className="detail-row">
                <span className="detail-label">Total Correct Answers</span>
                <span className="detail-value">{correctAnswers}</span>
              </div>
              <div className="detail-separator"></div>
              <div className="detail-row">
                <span className="detail-label">Total Questions Attended</span>
                <span className="detail-value">{questionsAttended}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="result-page-footer"></div>
    </div>
  );
};

export default ResultPage;
