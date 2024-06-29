
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const QuizComponent = ({ category }) => {
//   const [questions, setQuestions] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/fetch-quiz/${category}`);
//         console.log(response,'response')
//         setQuestions(response.data);
//         setError(''); 
//       } catch (error) {
//         setError('Error fetching questions');
//         console.error(error);
//       }
//     };

//     if (category) {
//       fetchQuiz();
//     }
//   }, [category]);

//   return (
//     <div>
//       {error && <p>{error}</p>}
//       <ul>
//         {questions.map((question, index) => (
//           <li key={index}>{question.question}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default QuizComponent;
// frontend/src/QuizComponent.js

import React, { useEffect } from 'react';
import axios from 'axios';

const QuizComponent = ({ category, onQuestionsFetched }) => {
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/fetch-quiz/${category}`);
        const fetchedQuestions = response.data;
        onQuestionsFetched(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [category, onQuestionsFetched]);

  return (
    <div>
      <h2>Loading questions...</h2>
    </div>
  );
};

export default QuizComponent;
