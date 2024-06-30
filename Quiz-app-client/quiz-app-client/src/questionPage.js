
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './questionPage.css';

// const QuestionPage = () => {
//   const { category } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchQuestions = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`http://localhost:3000/fetch-quiz/${category}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch questions');
//       }
//       const data = await response.json();
//       setQuestions(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   }, [category]);

//   useEffect(() => {
//     fetchQuestions();
//   }, [fetchQuestions]);

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };

//   const handleNextQuestion = () => {
//     if (questions != null) {
//       setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
//       setSelectedOption(null);
//     }
//   };

//   const handlePreviousQuestion = () => {
//     setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//     setSelectedOption(null);
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   } else {
//     const currentQuestion = questions[currentQuestionIndex];
//     const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
//     return (
//       <div className="question-page">
//         <header>
//           <button className="icon-button" onClick={() => navigate(-1)}>←</button>
//           <button className="icon-button">☰</button>
//           <button className="end-round-button">End round</button>
//         </header>
        
//         <main>
//           <div className="question-container">
//             <h2>Question {currentQuestionIndex + 1}</h2>
//             <p>{currentQuestion.question}</p>
//           </div>
          
//           <div className="options-container">
//             <h3>Select One Of The Following Options.</h3>
//             {options.map((option, index) => (
//               <label key={index} className="option">
//                 <input 
//                   type="radio" 
//                   name="answer" 
//                   value={option}
//                   checked={selectedOption === option}
//                   onChange={() => handleOptionChange(option)}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>
//         </main>
        
//         <footer>
//           <button className="nav-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>← Previous</button>
//           <button className="nav-button" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Save & Next →</button>
//         </footer>
//       </div>
//     );
//   }
// };

// export default QuestionPage;


import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './questionPage.css';

const QuestionPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3000/fetch-quiz/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [category]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (questions != null) {
      setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setSelectedOption(null);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    const currentQuestion = questions[currentQuestionIndex];
    const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    return (
      <div className="question-page">
        <header>
          <button className="icon-button" onClick={() => navigate(-1)}>←</button>
          <button className="icon-button">☰</button>
          <button className="end-round-button">End round</button>
        </header>
        
        <main>
          <div className="question-container">
            <h2>Question {currentQuestionIndex + 1}</h2>
            <p>{currentQuestion.question}</p>
          </div>
          
          <div className="options-container">
            <h3>Select One Of The Following Options.</h3>
            {options.map((option, index) => (
              <label key={index} className="option">
                <input 
                  type="radio" 
                  name="answer" 
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </main>
        
        <footer>
          <button className="nav-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>← Previous</button>
          <button className="nav-button" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Save & Next →</button>
        </footer>
      </div>
    );
  }
};

export default QuestionPage;