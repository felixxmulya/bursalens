'use client';
import { useState } from 'react';
import SearchBar from './components/search';
import ChatSection from './components/chat';
import AnalysisSection from './components/analysis';
import { StockData, Message, stockDatabase } from './components/stock';

export default function Prediction() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [predictionTimeframe, setPredictionTimeframe] = useState<'1m' | '3m'>('1m');

    const generateAIResponse = (query: string, stock?: StockData) => {
        if (stock) {
            return `Based on our analysis of ${stock.name} (${stock.symbol}), the stock shows ${
                stock.change > 0 ? 'positive' : 'negative'
            } momentum. Our AI model predicts a target price of Rp${
                stock.historicalData[5].prediction.toLocaleString()
            } in 3 months. This prediction is based on historical performance, market trends, and current economic indicators.`;
        }
        return "I can help you analyze Indonesian stocks. Try searching for a specific stock symbol (e.g., BBCA, TLKM) to get detailed analysis.";
    };

    const handleStockSearch = (query: string) => {
        const stock = stockDatabase[query.toUpperCase()];
        if (stock) {
            setSelectedStock(stock);
            const aiResponse = generateAIResponse(query, stock);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            }]);
        }
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user' as const,
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);

        // Check if message contains stock symbol
        const stockSymbols = Object.keys(stockDatabase);
        const mentionedStock = stockSymbols.find(symbol => 
            input.toUpperCase().includes(symbol)
        );

        if (mentionedStock) {
            handleStockSearch(mentionedStock);
        }

        setInput('');
    };

    return (
        <div className="max-w-7xl mx-auto h-full py-32">
            <SearchBar 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleStockSearch}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ChatSection 
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleSendMessage={handleSendMessage}
                />
                <AnalysisSection 
                    selectedStock={selectedStock}
                    predictionTimeframe={predictionTimeframe}
                    setPredictionTimeframe={setPredictionTimeframe}
                />
            </div>
        </div>
    );
}