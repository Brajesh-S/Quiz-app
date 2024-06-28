const axios = require('axios');

const fetchQuiz = async (type) => {
  const url = type === 'vehicles' ?
    'https://opentdb.com/api.php?amount=20&category=28' :
    'https://opentdb.com/api.php?amount=20&category=21';

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

module.exports = {
  fetchQuiz
};
