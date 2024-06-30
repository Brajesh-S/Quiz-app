
// import React, { useState } from 'react';
// import QuizComponent from './quiz';
// import QuestionPage from './questionPage';
// import { useNavigate } from 'react-router-dom';
// import './dashboard.css';

// const Dashboard = () => {
//   const [category, setCategory] = useState('');
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const navigate = useNavigate();

//   const handleSolveChallenge = (selectedCategory) => {
//     setCategory(selectedCategory);
//     console.log(selectedCategory, 'selected category')
//     navigate(`/fetch-quiz/${selectedCategory}`);
//   };

//   const handleQuestionsFetched = (fetchedQuestions) => {
//     setQuestions(fetchedQuestions);
//     setCurrentQuestionIndex(0);
//   };

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//   };

//   const handlePreviousQuestion = () => {
//     setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//   };

//   return (
//     <div className="quiz-app">
//       <div className="sidebar">
//         <h1 className="logo">Øendo</h1>
//         <div className="menu-item">
//           <span className="icon">⊞</span>
//           Tests
//         </div>
//       </div>
//       <div className="main-content">
//         <h2>Quizzes for you!</h2>
//         <div className="quiz-card">
//           <h3>Cybermind O Mania</h3>
//           <div className="quiz-details">
//             <span>Total Questions 20</span>
//             <span>Total points 100</span>
//           </div>
//           <button className="solve-btn yellow" onClick={() => handleSolveChallenge('vehicles')}>
//             Solve Challenge
//           </button>
    

//         </div>
//         <div className="quiz-card">
//           <h3>Cybermind O Mania</h3>
//           <div className="quiz-details">
//             <span>Total Questions 20</span>
//             <span>Total points 100</span>
//           </div>
//           <button className="solve-btn white" onClick={() => handleSolveChallenge('sports')}>
//             Solve Challenge
//           </button>
//         </div>
//         {category && !questions.length && (
//           <QuizComponent category={category} onQuestionsFetched={handleQuestionsFetched} />
//         )}
//         {questions.length > 0 && (
//           <QuestionPage
//             question={questions[currentQuestionIndex].question}
//             options={[...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer]}
//             onPrevious={handlePreviousQuestion}
//             onNext={handleNextQuestion}
//           />
//         )}
        
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSolveChallenge = (selectedCategory) => {
    navigate(`/fetch-quiz/${selectedCategory}`);
  };

  return (
    <div className="quiz-app">
      <div className="sidebar">
        <h1 className="logo">Øendo</h1>
        <div className="menu-item">
          <span className="icon">⊞</span>
          Tests
        </div>
      </div>
      <div className="main-content">
        <h2>Quizzes for you!</h2>
        <div className="quiz-card">
          <h3>Cybermind O Mania - Vehicles</h3>
          <div className="quiz-details">
            <span>Total Questions 20</span>
            <span>Total points 100</span>
          </div>
          <button className="solve-btn yellow" onClick={() => handleSolveChallenge('vehicles')}>
            Solve Challenge
          </button>
        </div>
        <div className="quiz-card">
          <h3>Cybermind O Mania - Sports</h3>
          <div className="quiz-details">
            <span>Total Questions 20</span>
            <span>Total points 100</span>
          </div>
          <button className="solve-btn white" onClick={() => handleSolveChallenge('sports')}>
            Solve Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

