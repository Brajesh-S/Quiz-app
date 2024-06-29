
import React, { useState } from 'react';
import './questionPage.css';

const QuestionPage = ({ question, options, onPrevious, onNext }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  if (!options) {
    return <p>Loading...</p>; 
  }
  console.log('hereeeeeeee')
  return (
    <div className="question-page">
      <header>
        <button className="icon-button" onClick={onPrevious}>←</button>
        <button className="icon-button">☰</button>
        <button className="end-round-button">End round</button>
      </header>
      
      <main>
        <div className="question-container">
          <h2>Question 1</h2> 
          <p>{question}</p>
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
              {option}
            </label>
          ))}
        </div>
      </main>
      
      <footer>
        <button className="nav-button" onClick={onPrevious}>← Previous</button>
        <button className="nav-button" onClick={onNext}>Save & Next →</button>
      </footer>
    </div>
  );
};

export default QuestionPage;
