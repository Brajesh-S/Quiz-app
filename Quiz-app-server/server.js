const express = require('express');
const quizService = require('./quiz'); 
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/fetch-quiz/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const questions = await quizService.fetchQuiz(category);
    res.status(200).json(questions);
  } catch (error) {
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
