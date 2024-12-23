import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_NEWS_API_URL;

export const fetchNews = async (category: string = 'saham') => {
    console.log('data:', category);
  try {
    const response = await axios.get(`${API_BASE_URL}/news`, {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};