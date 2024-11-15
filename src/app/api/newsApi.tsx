

export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
}

export const fetchNews = async (): Promise<NewsArticle[]> => {
    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=bbca&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        const data = await response.json();
        const sortedArticles = data.articles.sort((a: NewsArticle, b: NewsArticle) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        return sortedArticles || [];
    } catch (error) {
        console.error("Error fetching news:", error);
        throw new Error("Failed to fetch stock news");
    }
};