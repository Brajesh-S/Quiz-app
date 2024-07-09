// // Quizzes.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const Quizzes = () => {
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:3000/api/quizzes');
            setQuizzes(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
        };

        fetchQuizzes();
    }, []);
    const handleSolveChallenge = (quizId) => {
        navigate(`/questions/${quizId}`);
      };

  return (
    <div className="quizes-container">
        {isLoading ? 
            (<>Loading</>) :
            quizzes.map((quiz) => (
                <div className="quiz-card">
                    <h3>{quiz.quizName}</h3>
                    <div className="quiz-details">
                    <span>Total Questions {quiz.questionsCount}</span>
                    <span>Total points {quiz.questionsCount * quiz.markPerQuestion}</span>
                    </div>
                    <button onClick={() => handleSolveChallenge(quiz.id)}>Solve Challenge</button>
                </div>
            ))
        }
    </div>
  );
};

export default Quizzes;
