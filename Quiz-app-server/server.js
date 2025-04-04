const express = require("express");
const cors = require("cors");
const quizzesRouter = require("./Routes/quizzes");
const questionsRouter = require("./Routes/questions");
const optionsRouter = require("./Routes/options");
const db = require("./db");

const app = express();
const port = 3000; 

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://quiz-app-au1t.onrender.com",
      "https://quiz-app-client-k7i4.onrender.com",
    ],
    methods: ["POST", "GET", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/quizzes", quizzesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/options", optionsRouter);

app.delete("/api/quiz/clear/:quizId", async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const deleteQuery = "DELETE FROM MarkedAnswers WHERE quizId = ?";
    await db.query(deleteQuery, [quizId]);

    res.status(200).json({ message: "Quiz data cleared successfully" });
  } catch (error) {
    console.error("Error clearing quiz data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
