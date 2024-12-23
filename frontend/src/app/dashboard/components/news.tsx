"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchNews } from '@/app/api/news';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faNewspaper } from '@fortawesome/free-solid-svg-icons';


export default function News() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const imageLoader = ({ src }) => {
        return src;
    };

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

    return (
        <div className="mx-auto my-12 md:my-32 p-4 md:p-0 h-full">
            <h1 className="text-3xl font-bold text-center mb-6">
                <FontAwesomeIcon icon={faNewspaper} /> Latest News
            </h1>
            <div className="text-right mb-4">
                <Link href='/news' className="hover:text-blue-500 transition-colors duration-300">
                    Read More<FontAwesomeIcon icon={faChevronRight} className="ml-1 hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : news.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {news.slice(0, 6).map((item, index) => (
                        <Link
                            key={index}
                            href={item.data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow"
                        >
                            <Image
                                loader={imageLoader}
                                src={item.data.image_thumbnail}
                                alt={item.data.title}
                                width={400}
                                height={400}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            <p className="text-sm text-gray-600 mb-2">{item.data.time}</p>
                            <h2 className="text-lg font-semibold mb-2">{item.data.title}</h2>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No news available.</p>
            )}
        </div>
    );
}