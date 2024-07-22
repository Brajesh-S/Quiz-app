import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";
import Lottie from "lottie-react";

import loadingAnimationData from "./LoadingAnimation";

const LoadingAnimation = () => (
  <div className="loading-animations">
    <Lottie animationData={loadingAnimationData} loop={true} />
  </div>
);
const Quizzes = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("https://quiz-app-client-k7i4.onrender.com/api/quizzes");
        setQuizzes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);
  const handleSolveChallenge = (quizId) => {
    console.log(quizId, "quizzes.js");
    localStorage.clear();
    navigate(`/questions/${quizId}`);
  };

  return (
    <div className="quizes-container">
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        quizzes.map((quiz) => (
          <div className="quiz-card">
            <h3>{quiz.quizName}</h3>
            <div className="quiz-details">
              <div className="text">
                <span>Total Questions: {quiz.questionsCount}</span>{" "}
              </div>
              <div className="texts">
                <span>Total points: {quiz.questionsCount * 5}</span>{" "}
              </div>
            </div>
            <button
              className="solve-btn"
              onClick={() => handleSolveChallenge(quiz.id)}
            >
              Solve Challenge
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Quizzes;
