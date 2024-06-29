const axios = require('axios');

const fetchQuiz = async (category) => {
  let url;
  if (category === 'vehicles') {
    url = 'https://opentdb.com/api.php?amount=20&category=28';
  } else if (category === 'sports') {
    url = 'https://opentdb.com/api.php?amount=20&category=21';
  } else {
    throw new Error('Invalid category');
  }

  try {
    const response = await axios.get(url);
    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    throw error;
  }
};

module.exports = {
  fetchQuiz
};
