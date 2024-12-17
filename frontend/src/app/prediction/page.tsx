'use client';
import { useState, useEffect } from 'react';
import Analytics from '@/app/prediction/components/analytics';
import Chat from '@/app/prediction/components/chat';
import { stockData } from '../api/stock';
import { initialChatMessages } from './data/stock';

export default function Prediction() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const symbol = 'BBCA'; // You can make this dynamic later

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await stockData(symbol);
                setData(response.data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [symbol]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 lg:py-32">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Prediction Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <Analytics 
                            symbol={symbol}
                            data={data}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-1 flex flex-grow">
                        <Chat initialMessages={initialChatMessages}/>
                    </div>
                </div>
            </div>
        </div>
    );
}