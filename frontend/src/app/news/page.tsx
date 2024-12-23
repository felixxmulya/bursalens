'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '../components/loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { fetchNews } from '@/app/api/news';

export default function News() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleNews, setVisibleNews] = useState(7);
    const observer = useRef<any>();
    const ITEMS_PER_LOAD = 6;

    const imageLoader = ({ src }) => {
        return src;
    };

    const lastNewsElementRef = useCallback((node: any) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && visibleNews < news.length) {
                setVisibleNews(prev => Math.min(prev + ITEMS_PER_LOAD, news.length));
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, visibleNews, news.length]);

    useEffect(() => {
        const loadNews = async () => {
            setLoading(true);
            try {
                const data = await fetchNews();
                setNews(data);
            } catch (error) {
                console.error('Failed to load news:', error);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    if (loading && news.length === 0) {
        return (
            Loading()
        );
    }

    if (!news.length) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">No news available.</p>
                </div>
            </div>
        );
    }

    const featuredNews = news[0]?.data;
    const displayedNews = news.slice(1, visibleNews + 1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {featuredNews && (
                <div className="mb-12">
                    <Link href={featuredNews.link} target="_blank" rel="noopener noreferrer">
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2">
                                    <Image
                                        loader={imageLoader}
                                        src={featuredNews.image_thumbnail}
                                        alt={featuredNews.title}
                                        width={800}
                                        height={400}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="md:w-1/2 p-6">
                                    <div className="flex items-center mb-2">
                                        <span className="text-sm text-gray-600">{featuredNews.time}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3">{featuredNews.title}</h2>
                                    <p className="text-gray-600 mb-4">{featuredNews.description || featuredNews.title}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
                        Latest News
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayedNews.map((item, index) => (
                        <Link
                            key={index}
                            ref={index === displayedNews.length - 1 ? lastNewsElementRef : null}
                            href={item.data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <Image
                                loader={imageLoader}
                                src={item.data.image_thumbnail}
                                alt={item.data.title}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-sm text-gray-600">{item.data.time}</span>
                                </div>
                                <h3 className="font-bold mb-2">{item.data.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}