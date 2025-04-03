import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loadingAnimationData from "../../Assets/dashboardLoading.json";
import "./resultPage.css";

const ResultPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [resultData, setResultData] = useState({
    totalQuestions: undefined,
    questionsAttended: undefined,
    correctAnswers: undefined,
  });

  useEffect(() => {
    const { totalQuestions, questionsAttended, correctAnswers } =
      location.state || {};

    if (
      totalQuestions !== undefined &&
      questionsAttended !== undefined &&
      correctAnswers !== undefined
    ) {
      setResultData({ totalQuestions, questionsAttended, correctAnswers });
      setIsLoading(false);
    }
  }, [location.state]);

  const LoadingAnimation = () => (
    <div className="loading-animation">
      <Lottie animationData={loadingAnimationData} loop={true} />
    </div>
  );

  if (isLoading) {
    return <LoadingAnimation />;
  }

  const { totalQuestions, questionsAttended, correctAnswers } = resultData;
  const attendedPercentage = Math.round(
    (questionsAttended / totalQuestions) * 100
  );
  const correctPercentage = Math.round(
    (correctAnswers / questionsAttended) * 100
  );

  return (
    <div className="result-page-container">
      <header className="result-page-header">
        <h1>Quiz Results</h1>
      </header>
      <main className="result-page-content">
        <section className="report-section">
          <h2 className="thank-you-title">Thank you for taking the test!</h2>
          <p className="report-description">
            Here is a detailed report of your performance.
          </p>
          <div className="result-cards">
            <div className="result-card">
              <h3 className="card-title">Questions Attended</h3>
              <div
                className="circle-chart orange"
                style={{ "--percentage": attendedPercentage }}
              >
                <span className="chart-value">{questionsAttended}</span>
              </div>
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">Attended</span>
                  <span className="detail-value">{questionsAttended}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total</span>
                  <span className="detail-value">{totalQuestions}</span>
                </div>
              </div>
            </div>
            <div className="result-card">
              <h3 className="card-title">Correct Answers</h3>
              <div
                className="circle-chart green"
                style={{ "--percentage": correctPercentage }}
              >
                <span className="chart-value">{correctAnswers}</span>
              </div>
              <div className="result-details">
                <div className="detail-row">
                  <span className="detail-label">Correct</span>
                  <span className="detail-value">{correctAnswers}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Attempted</span>
                  <span className="detail-value">{questionsAttended}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="result-page-footer">
        <p>© 2025 Quiz App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ResultPage;
