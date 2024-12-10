import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const fetchNews = async (category: string = 'saham') => {
    console.log('data:', category);
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};