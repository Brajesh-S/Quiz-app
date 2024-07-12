import React, { useEffect } from 'react';
import './resultPage.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ResultPage = () => {
  const location = useLocation();
  const { totalQuestions, questionsAttended, correctAnswers, quizId } = location.state || {};

  useEffect(() => {
    
    if (quizId) {
      console.log('Sending request to clear quiz data...',quizId);

      axios.delete(`http://localhost:3000/api/quiz/clear/${quizId}`)
        .then(response => {
          console.log(response.data.message); 
          localStorage.removeItem('selectedAnswers'); 

        })
        .catch(error => {
          console.error('Error clearing quiz data:', error);
        });
    }
  }, [quizId]);
  
  if (totalQuestions === undefined || questionsAttended === undefined || correctAnswers === undefined ) {
    return <p>Loading...</p>;
  }

  return (
    <div className="result-page">
      <h1>Thank you for taking the test</h1>
      <h2>Your Report</h2>
      <div className="result-cards">
        <div className="result-card">
          <h3>Questions Attended</h3>
          <div className="result-value">{questionsAttended}</div>
          <div className="result-label">Total Questions Asked</div>
          <div className="result-value">{totalQuestions}</div>
        </div>
        <div className="result-card">
          <h3>Correct Answers</h3>
          <div className="result-value">{correctAnswers}</div>
          <div className="result-label">Total Questions Attended</div>
          <div className="result-value">{questionsAttended}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
