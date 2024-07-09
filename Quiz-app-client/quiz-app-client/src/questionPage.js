import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './questionPage.css';

const QuestionPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/api/questions/${quizId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [quizId]);

  const fetchOptions = useCallback(async (questionId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/options/${questionId}`);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      fetchOptions(currentQuestion.id);
    }
  }, [currentQuestionIndex, questions, fetchOptions]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      console.log('Submitting:', {
        questionId: currentQuestion.id,
        answer: selectedOption,
      });

      const response = await fetch('http://localhost:3000/api/answer/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: selectedOption,
        }),
      });

      const result = await response.json();
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        navigate('/result'); // Navigate to the result page after the last question
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="question-page">
      <header>
        <button className="icon-button" onClick={() => navigate(-1)}>←</button>
        <button className="icon-button">☰</button>
        <button className="end-round-button" onClick={handleSubmit}>End round</button>
      </header>

      <main>
        <div className="question-container">
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
                  value={option.optionText}
                  checked={selectedOption === option.optionText}
                  onChange={() => handleOptionChange(option.optionText)}
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
        <button
          className="nav-button"
          onClick={handleSubmit}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Save & Next →' : 'Submit'}
        </button>
      </footer>
    </div>
  );
};

export default QuestionPage;
