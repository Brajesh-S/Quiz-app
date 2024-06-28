
// const axios = require('axios');
// const db = require('./db'); 

// const storeQuestionsInDB = (questions, category) => {
//   questions.forEach(question => {
//     const { question: qText, correct_answer, incorrect_answers } = question;
//     db.query(
//       'INSERT INTO Questions (question, category) VALUES (?, ?)',
//       [qText, category],
//       (err, result) => {
//         if (err) throw err;
//         const questionId = result.insertId;
//         db.query(
//           'INSERT INTO Answers (question_id, answer, is_correct) VALUES (?, ?, ?)',
//           [questionId, correct_answer, true],
//           (err, result) => {
//             if (err) throw err;
//           }
//         );
//         incorrect_answers.forEach(answer => {
//           db.query(
//             'INSERT INTO Answers (question_id, answer, is_correct) VALUES (?, ?, ?)',
//             [questionId, answer, false],
//             (err, result) => {
//               if (err) throw err;
//             }
//           );
//         });
//       }
//     );
//   });
// };

// const fetchQuiz = async (category) => {
//   let apiUrl;
//   if (category === 'vehicles') {
//     apiUrl = 'https://opentdb.com/api.php?amount=20&category=28';
//   } else if (category === 'sports') {
//     apiUrl = 'https://opentdb.com/api.php?amount=20&category=21';
//   } else {
//     throw new Error('Invalid category');
//   }

//   try {
//     const response = await axios.get(apiUrl);
//     const questions = response.data.results;
//     await storeQuestionsInDB(questions, category);
//     return questions;
//   } catch (error) {
//     throw error; 
//   }
// };

// module.exports = { fetchQuiz };

const express = require('express');
const db = require('./db');
const { fetchQuizFromExternalApi } = require('./API/quizApi');

const router = express.Router();

// Fetch and store quizzes
router.get('/fetch-quiz/:type', async (req, res) => {
  const type = req.params.type;

  try {
    const questions = await fetchQuizFromExternalApi(type);

    questions.forEach((q) => {
      db.query('INSERT INTO Questions (question) VALUES (?)', [q.question], (err, result) => {
        if (err) throw err;
        const questionId = result.insertId;

        const answers = [
          { answer: q.correct_answer, is_correct: true },
          ...q.incorrect_answers.map((answer) => ({ answer, is_correct: false }))
        ];

        answers.forEach((a) => {
          db.query('INSERT INTO Answers (question_id, answer, is_correct) VALUES (?, ?, ?)', [questionId, a.answer, a.is_correct], (err, result) => {
            if (err) throw err;
          });
        });
      });
    });

    res.status(200).send('Questions fetched and stored');
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).send('Error fetching questions');
  }
});

// Submit user answer
router.post('/submit-answer', (req, res) => {
  const { userId, questionId, answer } = req.body;

  db.query('SELECT * FROM Answers WHERE question_id = ? AND is_correct = 1', [questionId], (err, result) => {
    if (err) throw err;
    const isCorrect = result[0].answer === answer;

    db.query('INSERT INTO UserAnswers (user_id, question_id, answer, is_correct) VALUES (?, ?, ?, ?)', [userId, questionId, answer, isCorrect], (err, result) => {
      if (err) throw err;

      const updateUserQuery = isCorrect ? 
        'UPDATE Users SET total_questions_attended = total_questions_attended + 1, correct_answers = correct_answers + 1 WHERE id = ?' : 
        'UPDATE Users SET total_questions_attended = total_questions_attended + 1 WHERE id = ?';

      db.query(updateUserQuery, [userId], (err, result) => {
        if (err) throw err;
        res.status(200).send({ isCorrect });
      });
    });
  });
});

module.exports = router;
