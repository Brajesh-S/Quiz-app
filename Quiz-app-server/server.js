
const express = require('express');
const cors = require('cors');
const quizzesRouter = require('./Routes/quizzes');
const questionsRouter = require('./Routes/questions');
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
  methods: ["POST", "GET", "OPTIONS", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/quizzes', quizzesRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/options', optionsRouter);

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



// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
