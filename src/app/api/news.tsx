import axios from 'axios';

export const fetchNews = async () => {
    const url = 'https://indonesia-news.p.rapidapi.com/search/cnn?query=saham+indonesia&page=1&limit=100';
    const options = {
        headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_NEWS_LOCAL_API_KEY,
            'x-rapidapi-host': 'indonesia-news.p.rapidapi.com',
        },
    };

    try {
        const response = await axios.get(url, options);
        return response.data.items || [];
    } catch (error) {
        console.error('Error fetching news data:', error);
        return [];
    }
};
