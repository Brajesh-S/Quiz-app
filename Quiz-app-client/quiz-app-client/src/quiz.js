
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizComponent = ({ category }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`https://quiz-app-client-k7i4.onrender.com/fetch-quiz/${category}`);
        console.log(response,'response')
        setQuestions(response.data);
        setError(''); 
      } catch (error) {
        setError('Error fetching questions');
        console.error(error);
      }
    };

    if (category) {
      fetchQuiz();
    }
  }, [category]);

  return (
    <div>
      {error && <p>{error}</p>}
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question.question}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizComponent;
