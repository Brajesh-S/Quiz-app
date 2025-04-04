const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:quizId", async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const query = `SELECT * FROM Questions WHERE quizId = ${quizId};`;
    const [questions] = await db.query(query);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/answer/submit", async (req, res) => {
  const { quizId, questionId, optionId } = req.body;
  try {
    const [quizStatus] = await db
      .query("SELECT isCompleted FROM Quizes WHERE id = ?", [quizId]);

    if (quizStatus.length === 0)
      return res.status(404).json({ error: "Quiz not found" });
    if (quizStatus[0].isCompleted)
      return res.status(400).json({ error: "Quiz is already completed." });

    const [submittedAnswers] = await db
      .query(
        "SELECT * FROM MarkedAnswers WHERE quizId = ? AND questionId = ?",
        [quizId, questionId]
      );
    let query;
    if (submittedAnswers.length === 0) {
      query =
        "INSERT INTO MarkedAnswers (quizId, questionId, selectedOptionId) VALUES (?, ?, ?)";
      await db.query(query, [quizId, questionId, optionId]);
    } else {
      query =
        "UPDATE MarkedAnswers SET selectedOptionId = ? WHERE quizId = ? AND questionId = ?";
      await db.query(query, [optionId, quizId, questionId]);
    }

    res.status(200).send();
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
