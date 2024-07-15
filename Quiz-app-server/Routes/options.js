const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:questionId", async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const query = `SELECT * FROM Options WHERE questionId = ${questionId};`;
    const [options] = await db.promise().query(query);
    res.json(options);
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
