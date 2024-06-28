require('dotenv').config();

const mysql = require('mysql2');
console.log(process.env.DB_HOST, process.env.DB_USER)

const db =  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
  });
  
  
const Questions = `
CREATE TABLE IF NOT EXISTS Questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  category VARCHAR(255) NOT NULL
);
`;
db.query(Questions, (err, result) => {
    if (err) throw err;
    console.log('Questions table created or already exists');
  });

const createAnswersTable = `
CREATE TABLE IF NOT EXISTS Answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  FOREIGN KEY (question_id) REFERENCES Questions(id)
);
`;

db.query(createAnswersTable, (err, result) => {
if (err) throw err;
console.log('Answers table created or already exists');
});


module.exports = db;
