import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_KEY;

export const fetchNews = async (category: string = 'saham') => {
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