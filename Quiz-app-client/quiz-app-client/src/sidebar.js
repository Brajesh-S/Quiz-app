// import React from 'react';
// import './sidebar.css';

// const Sidebar = ({ questions, selectedAnswers, currentQuestionIndex }) => {
//   return (
//     <div className="sidebar">
//       {questions.map((question, index) => (
//         <div key={question.id} className="sidebar-item">
//           <span className="question-number">{index + 1}</span>
//           <span className="question-text">MCQ</span>
//           <span
//             className={`question-status ${
//               index === currentQuestionIndex
//                 ? 'current'
//                 : selectedAnswers[question.id]
//                 ? 'answered'
//                 : ''
//             }`}
//           ></span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Sidebar;
