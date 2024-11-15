import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchNews, NewsArticle } from "@/app/api/newsApi";

export default function NewsDashboard() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const imageLoader = ({ src }) => {
        return src;
    };

    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            try {
                const newsData = await fetchNews();
                setNews(newsData);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false);
            }
        };

        getNews();
    }, []);

    return (
        <section className="py-16 px-8 md:px-28 bg-gray-50">
            <h2 className="text-3xl font-bold text-center mb-8">Latest Indonesia Stock Market News</h2>
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {news.length === 0 ? (
                        <p className="text-center">No news available.</p>
                    ) : (
                        news.slice(0, 3).map((article, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                {article.urlToImage && (
                                    <Image
                                        loader={imageLoader}
                                        src={article.urlToImage}
                                        alt={article.title}
                                        width={500}
                                        height={300}
                                        className="w-full h-60 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                                <p className="text-gray-600 mb-4">{article.description}</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Read more
                                </a>
                            </div>
                        ))
                    )}
                </div>
            )}
        </section>
    );
}