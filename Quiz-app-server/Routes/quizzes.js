// quizzes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
      const query = 'SELECT * FROM Quizes;';
      const [quizzes] = await db.promise().query(query);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/complete/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    try {
      const updateQuery = 'UPDATE quizes SET isCompleted = TRUE WHERE id = ?';
      await db.promise().query(updateQuery, [quizId]);
      res.status(200).json({ message: 'Quiz marked as completed successfully' });
    } catch (error) {
      console.error('Error marking quiz as completed:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/status/:quizId', async (req, res) => {
    const quizId = req.params.quizId;
    try {
      const [totalQuestionsResult] = await db.promise().query(
        'SELECT COUNT(*) AS totalQuestions FROM Questions WHERE quizId = ?',
        [quizId]
      );
      const totalQuestions = totalQuestionsResult[0].totalQuestions;
  
      const [questionsAttendedResult] = await db.promise().query(
        'SELECT COUNT(*) AS questionsAttended FROM MarkedAnswers WHERE quizId = ?',
        [quizId]
      );
      const questionsAttended = questionsAttendedResult[0].questionsAttended;
  
      const [correctAnswersResult] = await db.promise().query(
        `SELECT COUNT(*) AS correctAnswers
         FROM MarkedAnswers ma
         INNER JOIN Options o ON ma.selectedOptionId = o.id
         WHERE ma.quizId = ? AND o.isCorrect = 1`,
        [quizId]
      );
      const correctAnswers = correctAnswersResult[0].correctAnswers;
  
      const quizStatus = { totalQuestions, questionsAttended, correctAnswers };
      res.status(200).json(quizStatus);
    } catch (error) {
      console.error('Error retrieving quiz status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;

