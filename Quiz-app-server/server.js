const express = require('express');
const quizService = require('./quiz'); 
const db = require('./db');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000"
    ],
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.get('/fetch-quiz/:category', async (req, res) => {
  const { category } = req.params;
  try {
    let url;
    if (category === 'vehicles') {
      url = 'https://opentdb.com/api.php?amount=20&category=28';
    } else if (category === 'sports') {
      url = 'https://opentdb.com/api.php?amount=20&category=21';
    } else {
      throw new Error('Invalid category');
    }

    const response = await axios.get(url);
    const questions = response.data.results;

    const insertQuestionsPromises = questions.map(question => {
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO Questions (question, category) VALUES (?, ?)',
          [question.question, category],
          (err, result) => {
            if (err) return reject(err);
            const questionId = result.insertId;

            const answers = [
              ...question.incorrect_answers.map(answer => [questionId, answer, false]),
              [questionId, question.correct_answer, true]
            ];

            db.query(
              'INSERT INTO Answers (question_id, answer, is_correct) VALUES ?',
              [answers],
              (err, result) => {
                if (err) return reject(err);
                resolve();
              }
            );
          }
        );
      });
    });

    await Promise.all(insertQuestionsPromises);

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
});

// Endpoint to submit user answer
app.post('/submit-answer', (req, res) => {
  const { userId, questionId, answer } = req.body;

  db.query(
    'SELECT is_correct FROM Answers WHERE question_id = ? AND answer = ?',
    [questionId, answer],
    (err, results) => {
      if (err) throw err;
      const isCorrect = results.length > 0 ? results[0].is_correct : false;

      db.query(
        'UPDATE usersTable SET total_question_attended = total_question_attended + 1, correct_answers = correct_answers + ? WHERE id = ?',
        [isCorrect ? 1 : 0, userId],
        (err, result) => {
          if (err) throw err;
          res.status(200).send({ correct: isCorrect });
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
