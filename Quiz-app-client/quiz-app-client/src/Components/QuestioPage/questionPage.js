import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./questionPage.css";
import QuestionSidebar from "../QuestionSidebar/QuestionSidebar";
import Lottie from "lottie-react";
import loadingAnimationData from "../../Assets/dashboardLoading.json";
import CircularProgress from "@mui/material/CircularProgress";

const QuestionPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNextButtonLoading, setIsNextButtonLoading] = useState(false);
  const [isPrevButtonLoading, setIsPrevButtonLoading] = useState(false);

  const LoadingAnimation = () => (
    <div className="loading-animation">
      <Lottie animationData={loadingAnimationData} loop={true} />
    </div>
  );

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(quizId, "questionpage.js");
      const response = await fetch(
        `https://quiz-app-au1t.onrender.com/api/questions/${quizId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }, [quizId]);

  const fetchOptions = useCallback(async (questionId) => {
    try {
      const response = await axios.get(
        `https://quiz-app-au1t.onrender.com/api/options/${questionId}`
      );
      console.log("Fetched options:", response.data);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }, []);

  useEffect(() => {
    const clearPreviousQuizData = async () => {
      try {
        await axios.delete(`https://quiz-app-au1t.onrender.com/api/quiz/clear/${quizId}`);
        console.log(`Cleared data for quizId ${quizId}`);
      } catch (error) {
        console.error("Error clearing quiz data:", error);
      }
    };

    clearPreviousQuizData();
    fetchQuestions();
  }, [quizId, fetchQuestions]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      fetchOptions(currentQuestion.id);
    }
  }, [currentQuestionIndex, questions, fetchOptions]);
  
  useEffect(() => {
    console.log("Current options:", options);
  }, [options]);
  
  useEffect(() => {
    const savedAnswers =
      JSON.parse(localStorage.getItem("selectedAnswers")) || {};
    setSelectedAnswers(savedAnswers);
  }, []);

  useEffect(() => {
    localStorage.removeItem("selectedAnswers");
    setSelectedAnswers({});
  }, [quizId]);

  useEffect(() => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNextQuestion = async () => {
    setIsNextButtonLoading(true);
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionId = selectedAnswers[currentQuestion.id];

    try {
      if (selectedOptionId !== undefined) {
        await axios.post("https://quiz-app-au1t.onrender.com/api/questions/answer/submit", {
          quizId: currentQuestion.quizId,
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        });
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const resultResponse = await axios.get(
          `https://quiz-app-au1t.onrender.com/api/quizzes/status/${currentQuestion.quizId}`
        );

        navigate("/result", {
          state: resultResponse.data,
          quizId: currentQuestion.quizId,
        });
      }
      setIsNextButtonLoading(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handlePreviousQuestion = () => {
    setIsPrevButtonLoading(true);
    if (currentQuestionIndex > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const selectedOptionId = selectedAnswers[currentQuestion.id];

      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: selectedOptionId,
      }));

      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    setIsPrevButtonLoading(false);
  };

  const handleEndRound = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const selectedOptionId = selectedAnswers[currentQuestion.id];

      if (selectedOptionId !== undefined) {
        await axios.post("https://quiz-app-au1t.onrender.com/api/questions/answer/submit", {
          quizId: currentQuestion.quizId,
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        });
      }

      const resultResponse = await axios.get(
        `https://quiz-app-au1t.onrender.com/api/quizzes/status/${currentQuestion.quizId}`
      );

      navigate("/result", {
        state: resultResponse.data,
        quizId: currentQuestion.quizId,
      });
    } catch (error) {
      console.error("Error ending round:", error);
    }
  };

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (!questions || questions.length === 0) {
    return <p>No questions available.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQuestion.id];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="question-page">
      <header className="question-header">
        <div className="header-left">

          <button className="icon-button sidebar-toggle" onClick={toggleSidebar}>≡
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className="header-center">
          <div className="progress-indicator">
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="end-round-button" onClick={handleEndRound}>
            End Quiz
          </button>
        </div>
      </header>

      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-active' : ''}`}>
        {isSidebarOpen && (
          <QuestionSidebar
            questions={questions}
            selectedAnswers={selectedAnswers}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            closeSidebar={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="quiz-content">
          <div className="question-container">
            <h2 className="question-title">Question {currentQuestionIndex + 1}</h2>
            <p className="question-text">{currentQuestion.question}</p>
          </div>

          <div className="options-container">
            <h3 className="options-heading">Select One Of The Following Options</h3>
            <div className="options-list">
              {options.length > 0 ? (
                options.map((option) => (
                  <label 
                    key={option.id} 
                    className={`option ${selectedOptionId === option.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`answer-${currentQuestion.id}`}
                      value={option.id}
                      checked={selectedOptionId === option.id}
                      onChange={() =>
                        handleOptionSelect(currentQuestion.id, option.id)
                      }
                    />
                    <span className="option-text">{option.option_text}</span>
                  </label>
                ))
              ) : (
                <p className="no-options-message">No options available.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="question-footer">
        <button
          className={`nav-button prev-button ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          {isPrevButtonLoading ? (
            <CircularProgress
              className="button-loading-spinner"
              color="inherit"
              size={15}
            />
          ) : (
            <>
              <i className="fas fa-chevron-left"></i>
              <span>Previous</span>
            </>
          )}
        </button>
        
        <div className="question-indicator-mobile">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        
        <button className="nav-button next-button" onClick={handleNextQuestion}>
          {isNextButtonLoading ? (
            <CircularProgress
              className="button-loading-spinner"
              color="inherit"
              size={15}
            />
          ) : currentQuestionIndex < questions.length - 1 ? (
            <>
              <span>Next</span>
              <i className="fas fa-chevron-right"></i>
            </>
          ) : (
            <>
              <span>Submit</span>
              <i className="fas fa-check"></i>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};

export default QuestionPage;