import axios from "axios";

const proxyUrl = 'https://api.allorigins.win/get?url=';
const news_cnbc = 'https://berita-indo-api-next.vercel.app/api/cnbc-news/market';

export const fetchNews = async () => {
    try {
        const encodedUrl = encodeURIComponent(news_cnbc);
        const response = await axios.get(`${proxyUrl}${encodedUrl}`);

        const parsedData = JSON.parse(response.data.contents);

        return parsedData.data.map(item => ({
            data: {
                title: item.title,
                link: item.link,
                time: item.isoDate,
                image_thumbnail: item.image?.small || '',
                contentSnippet: item.contentSnippet
            }
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}