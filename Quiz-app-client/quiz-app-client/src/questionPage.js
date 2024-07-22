import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./questionPage.css";
import QuestionSidebar from "./QuestionSidebar";
import Lottie from "lottie-react";
import loadingAnimationData from "./dashboardLoading";
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
        `https://quiz-app-client-k7i4.onrender.com/api/questions/${quizId}`
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
        `https://quiz-app-client-k7i4.onrender.com/api/options/${questionId}`
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
        await axios.delete(`https://quiz-app-client-k7i4.onrender.com/api/quiz/clear/${quizId}`);
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
        await axios.post("https://quiz-app-client-k7i4.onrender.com/api/questions/answer/submit", {
          quizId: currentQuestion.quizId,
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        });
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const resultResponse = await axios.get(
          `https://quiz-app-client-k7i4.onrender.com/api/quizzes/status/${currentQuestion.quizId}`
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
        await axios.post("https://quiz-app-client-k7i4.onrender.com/api/questions/answer/submit", {
          quizId: currentQuestion.quizId,
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        });
      }

      const resultResponse = await axios.get(
        `https://quiz-app-client-k7i4.onrender.com/api/quizzes/status/${currentQuestion.quizId}`
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
      <header>
        <button className="icon-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <button className="icon-button" onClick={toggleSidebar}>
          ☰
        </button>
        <button className="end-round-button" onClick={handleEndRound}>
          End round
        </button>
      </header>

      <main>
        <div className="question-container">
          {isSidebarOpen && (
            <QuestionSidebar
              questions={questions}
              selectedAnswers={selectedAnswers}
              currentQuestionIndex={currentQuestionIndex}
            />
          )}
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{currentQuestion.question}</p>
        </div>

        <div className="options-container">
          <h3>Select One Of The Following Options.</h3>
          <div className="options-list">
            {options.length > 0 ? (
              options.map((option) => (
                <label key={option.id} className="option">
                  <input
                    type="radio"
                    name={`answer-${currentQuestion.id}`}
                    value={option.id}
                    checked={selectedOptionId === option.id}
                    onChange={() =>
                      handleOptionSelect(currentQuestion.id, option.id)
                    }
                  />
                  <span>{option.option_text}</span>
                </label>
              ))
            ) : (
              <p>No options available.</p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <button
          className="nav-button"
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
            "← Previous"
          )}
        </button>
        <button className="nav-button" onClick={handleNextQuestion}>
          {isNextButtonLoading ? (
            <CircularProgress
              className="button-loading-spinner"
              color="inherit"
              size={15}
            />
          ) : currentQuestionIndex < questions.length - 1 ? (
            "Save & Next →"
          ) : (
            "Submit"
          )}
        </button>
      </footer>
    </div>
  );
};

export default QuestionPage;
