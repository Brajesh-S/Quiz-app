import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./questionPage.css";
import QuestionSidebar from "./QuestionSidebar";

const QuestionPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(quizId, "questionpage.js");
      const response = await fetch(
        `http://localhost:3000/api/questions/${quizId}`
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
        `http://localhost:3000/api/options/${questionId}`
      );
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }, []);

  useEffect(() => {
    const clearPreviousQuizData = async () => {
      try {
        await axios.delete(`http://localhost:3000/api/quiz/clear/${quizId}`);
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
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOptionId = selectedAnswers[currentQuestion.id];

    try {
      if (selectedOptionId !== undefined) {
        await axios.post("http://localhost:3000/api/questions/answer/submit", {
          quizId: currentQuestion.quizId,
          questionId: currentQuestion.id,
          optionId: selectedOptionId,
        });
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const resultResponse = await axios.get(
          `http://localhost:3000/api/quizzes/status/${currentQuestion.quizId}`
        );
        console.log(
          resultResponse.data,
          currentQuestion.quizId,
          "questionpage.js"
        );
        navigate("/result", {
          state: resultResponse.data,
          quizId: currentQuestion.quizId,
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const selectedOptionId = selectedAnswers[currentQuestion.id];

      setSelectedAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: selectedOptionId,
      }));

      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
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
        <button className="end-round-button" onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1
            ? "End round"
            : "End round"}
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
            {options.map((option) => (
              <label key={option.id} className="option">
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedOptionId === option.id}
                  onChange={() =>
                    handleOptionSelect(currentQuestion.id, option.id)
                  }
                />
                <span>{option.optionText}</span>
              </label>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <button
          className="nav-button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>
        <button className="nav-button" onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1
            ? "Save & Next →"
            : "Submit"}
        </button>
      </footer>
    </div>
  );
};

export default QuestionPage;
