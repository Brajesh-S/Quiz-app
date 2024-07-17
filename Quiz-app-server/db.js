const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
});

// Function to create tables
async function createTables() {
  try {
    // await db.promise().query(`
    //   CREATE TABLE IF NOT EXISTS QuizTypes (
    //     id INT AUTO_INCREMENT PRIMARY KEY,
    //     type_name VARCHAR(255) NOT NULL
    //   )
    // `);
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS Quizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizName VARCHAR(255) NOT NULL,
        isCompleted TINYINT(1) NOT NULL,
        questionsCount INT NOT NULL,
        markPerQuestion INT NOT NULL,
        quiz_type_id INT,
      )
    `);
    
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS Quizes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quiz_type_id INT,
        quizName VARCHAR(255),
        FOREIGN KEY (quiz_type_id) REFERENCES QuizTypes(id)
      )
    `);

    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS Questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizId INT,
        question TEXT NOT NULL,
        FOREIGN KEY (quizId) REFERENCES Quizes(id)
      )
    `);

    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS Options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        questionId INT,
        option_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        FOREIGN KEY (questionId) REFERENCES Questions(id)
      )
    `);

    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS MarkedAnswers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quizId INT,
        questionId INT,
        selectedOptionId INT,
        FOREIGN KEY (quizId) REFERENCES Quizes(id),
        FOREIGN KEY (questionId) REFERENCES Questions(id),
        FOREIGN KEY (selectedOptionId) REFERENCES Options(id)
      )
    `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function insertQuizes() {
  try {
    await db.promise().query(`
      INSERT INTO Quizes (quizName, isCompleted, questionsCount, markPerQuestion) VALUES
      ('Cars', 0, 5, 5),
      ('Mobiles', 0, 5, 5)
    `);
  } catch (error) {
    console.error("Error inserting quizzes:", error);
  }
}

// Function to insert questions and options
async function insertQuestions() {
  try {
    // Insert your questions and options logic here
    await db.promise().query(`
      INSERT INTO Questions (quizId, question) VALUES
      (1, 'Which car manufacturer produces the Mustang?'),
      (1, 'What year was the Ford Model T introduced?'),
      (1, 'Which car brand has a logo with a prancing horse?'),
      (1, 'What is the top speed of a Bugatti Veyron Super Sport?'),
      (1, 'Which company makes the Corvette?'),
      (2, 'Which company created the first iPhone?'),
      (2, 'What is the latest version of Android?'),
      (2, 'Which company launched the OnePlus series of phones?'),
      (2, 'What does OLED stand for in display technology?'),
      (2, 'Who produces the Snapdragon processors for smartphones?')
    `);
    console.log("Questions inserted successfully");
  } catch (error) {
    console.error("Error inserting questions:", error);
    throw error;
  }
}

async function insertOptions() {
  try {
    await db.promise().query(`
      INSERT INTO Options (questionId, option_text, is_correct) VALUES
      (1, 'BMW', 0),
      (1, 'Ford', 1),
      (1, 'Chevrolet', 0),
      (1, 'Toyota', 0),
      (2, '1923', 0),
      (2, '1908', 1),
      (2, '1912', 0),
      (2, '1932', 0),
      (3, 'Porsche', 0),
      (3, 'Lamborghini', 0),
      (3, 'Maserati', 0),
      (3, 'Ferrari', 1),
      (4, '230 mph', 0),
      (4, '267 mph', 1),
      (4, '220 mph', 0),
      (4, '250 mph', 0),
      (5, 'Chevrolet', 1),
      (5, 'Ford', 0),
      (5, 'Dodge', 0),
      (5, 'Tesla', 0),
      (6, 'Samsung', 0),
      (6, 'Nokia', 0),
      (6, 'Apple', 1),
      (6, 'HTC', 0),
      (7, 'Android 11', 0),
      (7, 'Android 10', 0),
      (7, 'Android 9', 0),
      (7, 'Android 12', 1),
      (8, 'OnePlus', 1),
      (8, 'Xiaomi', 0),
      (8, 'Huawei', 0),
      (8, 'Sony', 0),
      (9, 'Open Light Emitting Display', 0),
      (9, 'Optical Liquid Emitting Diode', 0),
      (9, 'Organic Light Emitting Diode', 1),
      (9, 'Organic Liquid Electroluminescence Display', 0),
      (10, 'Intel', 0),
      (10, 'Qualcomm', 1),
      (10, 'AMD', 0),
      (10, 'Apple', 0)
    `);
  } catch (error) {
    console.error("Error inserting options:", error);
  }
}

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to database");

  createTables()
  .then(() => insertQuizes())
    .then(() => insertQuestions())
    .then(() => insertOptions())
    .catch((err) => console.error("Error initializing database:", err));
});

module.exports = db;
