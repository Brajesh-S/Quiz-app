const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:questionId', async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const query = `SELECT * FROM Options WHERE questionId = ${questionId};`;
    const [options] = await db.promise().query(query);
    res.json(options);
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// router.get('/markedanswers/:quizId/:questionId', async (req, res) => {
//   const { quizId, questionId } = req.params;

//   try {
//     const query = 'SELECT * FROM MarkedAnswers WHERE quizId = ? AND questionId = ?';
//     const [rows] = await db.promise().query(query, [quizId, questionId]);

//     if (rows.length > 0) {
//       res.json(rows);
//     } else {
//       res.status(404).json({ message: 'No answer found for this question.' });
//     }
//   } catch (error) {
//     console.error('Error checking marked answers:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });;

module.exports = router;
