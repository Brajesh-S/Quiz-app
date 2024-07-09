
import React from 'react';
import './resultPage.css';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const { total_question_attended, correct_answers } = location.state || {};

  if (total_question_attended === undefined || correct_answers === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div className="result-page">
      <h1>Thank you for taking the test</h1>
      <h2>Your Report</h2>
      <div className="result-cards">
        <div className="result-card">
          <h3>Questions Attended</h3>
          <div className="result-value">{total_question_attended}</div>
        </div>
        <div className="result-card">
          <h3>Correct Answers</h3>
          <div className="result-value">{correct_answers}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
