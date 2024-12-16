'use client';
import { useState } from 'react';
import SearchBar from './components/search';
import Chat from './components/chat';
import Analysis from './components/analysis';
import { StockData, Message } from './components/stock';

export default function Prediction() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [predictionTimeframe, setPredictionTimeframe] = useState(3);
    const [loading, setLoading] = useState(false);

    const generateAIResponse = (stock: StockData) => {
        return `Based on our analysis of ${stock.name} (${stock.symbol}), the stock shows ${
            stock.change > 0 ? 'positive' : 'negative'
        } momentum. Current price is Rp${stock.currentPrice.toLocaleString()} with RSI at ${
            stock.technicalIndicators.lastRSI
        }. The prediction shows a target of Rp${
            stock.historicalData[stock.historicalData.length - 1].prediction.toLocaleString()
        } in 3 months.`;
    };

    const handleStockSearch = async (query: string) => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:5000/stock/${query.toUpperCase()}`);
            const data = await response.json();

            if (data.status === 'success') {
                setSelectedStock(data.data);
                const aiResponse = generateAIResponse(data.data);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: aiResponse,
                    timestamp: new Date()
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Sorry, I couldn't find data for ${query}. Please try another stock symbol.`,
                    timestamp: new Date()
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, there was an error fetching the stock data. Please try again later.',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user' as const,
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Look for stock symbols in the message (4 uppercase letters)
        const match = input.toUpperCase().match(/\b[A-Z]{4}\b/);
        if (match) {
            await handleStockSearch(match[0]);
        } else {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I can help you analyze Indonesian stocks. Try mentioning a stock symbol like BBCA or TLKM.",
                timestamp: new Date()
            }]);
        }

        setInput('');
    };

    return (
        <div className="max-w-7xl mx-auto h-full py-32">
            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleStockSearch}
                loading={loading}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Chat 
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleSendMessage={handleSendMessage}
                />
                <Analysis 
                    selectedStock={selectedStock}
                    predictionTimeframe={predictionTimeframe}
                    setPredictionTimeframe={setPredictionTimeframe}
                />
            </div>
        </div>
    );
}