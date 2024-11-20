import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNews } from '@/app/api/news';

export default function News() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const imageLoader = ({ src }) => {
        return src;
    };

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            const data = await fetchNews();
            setNews(data);
            setLoading(false);
        };

        loadNews();
    }, []);

    return (
        <div className="container mx-auto px-12 py-12 md:px-32">
            <h1 className="text-2xl font-bold text-center mb-6">Latest News</h1>
            <Link className='text-end' href='/' target="_blank"> Read more </Link>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : news.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {news.slice(0, 3).map((item, index) => (
                        <Link
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <Image
                                loader={imageLoader}
                                src={item.images.cover}
                                alt={item.title}
                                width={400}
                                height={400}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">{item.date.summary}</p>
                            <p className="text-xs text-gray-400">{item.date.publish}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No news available.</p>
            )}
        </div>
    );
}
