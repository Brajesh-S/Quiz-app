// server.js
const express = require('express');
const cors = require('cors');
const quizzesRouter = require('./Routes/quizzes');
const questionsRouter= require('./Routes/questions');
const optionsRouter = require('./Routes/options');
const db = require('./db');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3001",
    "http://localhost:3000"
  ],
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.get('/api/quizzes', async (req, res) => {
  try {
    // Query to fetch all quizzes from QuizTypes table
    const query = 'SELECT * FROM Quizes;';
    const [quizzes] = await db.promise().query(query);

    res.json(quizzes); // Send JSON response with quizzes data
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/questions/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    // Query to fetch all quizzes from QuizTypes table
    const query = `SELECT * FROM Questions where quizId = ${quizId};`;
    const [questions] = await db.promise().query(query);
    res.json(questions); // Send JSON response with quizzes data
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/options/:questionId', async (req, res) => {
  const questionId = req.params.questionId;

  try {
    // Query to fetch all quizzes from QuizTypes table
    const query = `SELECT * FROM Options where questionId = ${questionId};`;
    const [options] = await db.promise().query(query);

    res.json(options); // Send JSON response with quizzes data
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/answer/submit', async (req, res) => {
  const { quizId, questionId, optionId } = req.body;

  try {
    // Check if quiz exists
    const [quizExists] = await db.promise().query(
      'SELECT id FROM Quizes WHERE id = ?',
      [quizId]
    );

    if (quizExists.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check if question exists and belongs to the quiz
    const [questionExists] = await db.promise().query(
      'SELECT id FROM Questions WHERE id = ? AND quizId = ?',
      [questionId, quizId]
    );

    if (questionExists.length === 0) {
      return res.status(404).json({ error: 'Question not found or does not belong to this quiz' });
    }

    // Check if option exists and belongs to the question
    const [optionExists] = await db.promise().query(
      'SELECT id FROM Options WHERE id = ? AND questionId = ?',
      [optionId, questionId]
    );

    if (optionExists.length === 0) {
      return res.status(404).json({ error: 'Option not found or does not belong to this question' });
    }

    // If all checks pass, insert the answer
    await db.promise().query(
      'INSERT INTO MarkedAnswers (quizId, questionId, selectedOptionId) VALUES (?, ?, ?)',
      [quizId, questionId, optionId]
    );

    res.status(200).json({ message: 'Answer submitted successfully' });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/quiz/complete/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const updateQuery = 'UPDATE quizes SET isCompleted = TRUE WHERE id = ?';
    const [result] = await db.promise().query(updateQuery, [quizId]);

    res.status(200).json({ message: 'Quiz marked as completed successfully' });
  } catch (error) {
    console.error('Error marking quiz as completed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quiz/status/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    // Count total questions
    const [totalQuestionsResult] = await db.promise().query(
      'SELECT COUNT(*) AS totalQuestions FROM Questions WHERE quizId = ?',
      [quizId]
    );
    const totalQuestions = totalQuestionsResult[0].totalQuestions;

    // Count questions attended (submitted answers)
    const [questionsAttendedResult] = await db.promise().query(
      'SELECT COUNT(*) AS questionsAttended FROM MarkedAnswers WHERE quizId = ?',
      [quizId]
    );
    const questionsAttended = questionsAttendedResult[0].questionsAttended;

    // Count correct answers
    const [correctAnswersResult] = await db.promise().query(
      `SELECT COUNT(*) AS correctAnswers
       FROM MarkedAnswers ma
       INNER JOIN Options o ON ma.selectedOptionId = o.id
       WHERE ma.quizId = ? AND o.isCorrect = 1`,
      [quizId]
    );
    const correctAnswers = correctAnswersResult[0].correctAnswers;

    // Prepare response object
    const quizStatus = {
      totalQuestions,
      questionsAttended,
      correctAnswers
    };

    // Send JSON response
    res.status(200).json(quizStatus);
  } catch (error) {
    console.error('Error retrieving quiz status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/quiz/clear/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    // Delete marked answers for the given quizId
    const deleteQuery = 'DELETE FROM MarkedAnswers WHERE quizId = ?';
    await db.promise().query(deleteQuery, [quizId]);

    res.status(200).json({ message: 'Quiz data cleared successfully' });
  } catch (error) {
    console.error('Error clearing quiz data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Routes
app.use('/api/quizzes', quizzesRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/options', optionsRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
