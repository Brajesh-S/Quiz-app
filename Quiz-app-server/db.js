const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});
const promisePool = pool.promise();

async function createTables() {
  try {
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS QuizTypes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type_name VARCHAR(255) NOT NULL
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Quizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizName VARCHAR(255) NOT NULL,
        isCompleted TINYINT(1) NOT NULL,
        questionsCount INT NOT NULL,
        markPerQuestion INT NOT NULL,
        quiz_type_id INT,
        FOREIGN KEY (quiz_type_id) REFERENCES QuizTypes(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizId INT,
        question TEXT NOT NULL,
        FOREIGN KEY (quizId) REFERENCES Quizes(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS Options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionId INT,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        FOREIGN KEY (questionId) REFERENCES Questions(id)
      );
    `);

    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS MarkedAnswers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizId INT,
        questionId INT,
        selectedOptionId INT,
        FOREIGN KEY (quizId) REFERENCES Quizes(id),
        FOREIGN KEY (questionId) REFERENCES Questions(id),
        FOREIGN KEY (selectedOptionId) REFERENCES Options(id)
      );
    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to database");
  connection.release();

  createTables().catch(err => console.error("Error creating tables:", err));
});

module.exports = promisePool;
