import React, { useState, useEffect } from 'react';
import { stockData } from '@/app/api/stock';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChartLine, faMoneyBill, faPercent, faChartBar, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

export default function StockAnalytics() {
    const [data, setData] = useState<any>(null);
    const [symbol, setSymbol] = useState('BBCA');
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('price');

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                const response = await stockData(symbol);
                setData(response.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch stock data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStockData();
    }, [symbol]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSymbol(searchInput.toUpperCase());
    };

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!data) return null;
    

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white">
            {/* Search Bar */}
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Enter stock code (e.g., BBCA, TLKM)"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Stock Info Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {data.name} ({symbol})
                </h1>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-green-500" />
                    <span className="text-2xl font-semibold">
                        Rp {data.currentPrice.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Market Cap</p>
                            <p className="text-xl font-bold">
                                Rp {(data.fundamentals.marketCap / 1e12).toFixed(2)} T
                            </p>
                        </div>
                        <FontAwesomeIcon icon={faChartBar} className="text-blue-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">P/E Ratio</p>
                            <p className="text-xl font-bold">{data.fundamentals.PE?.toFixed(2) || 'N/A'}</p>
                        </div>
                        <FontAwesomeIcon icon={faExchangeAlt} className="text-purple-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">ROE</p>
                            <p className="text-xl font-bold">
                                {data.fundamentals.ROA ? `${(data.fundamentals.ROA)}%` : 'N/A'}
                            </p>
                        </div>
                        <FontAwesomeIcon icon={faPercent} className="text-yellow-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Dividend Yield</p>
                            <p className="text-xl font-bold">
                                {data.fundamentals.dividendYield
                                    ? `${(data.fundamentals.dividendYield).toFixed(2)}%`
                                    : 'N/A'}
                            </p>
                        </div>
                        <FontAwesomeIcon icon={faChartLine} className="text-green-500 text-xl" />
                    </div>
                </div>
            </div>

            {/* Model Metrics */}
            <div className="my-6">
                <h2 className="text-xl font-bold mb-4">Metrik Model</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <p className="text-sm text-gray-500">MAPE</p>
                        <p className="text-xl font-bold">
                            {(data.modelMetrics.mape).toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <p className="text-sm text-gray-500">R² Score</p>
                        <p className="text-xl font-bold">
                            {(data.modelMetrics.r2_score).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <p className="text-sm text-gray-500">Akurasi Arah</p>
                        <p className="text-xl font-bold">
                            {(data.modelMetrics.directional_accuracy).toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Navigation */}
            <div className="mb-4">
                <div className="flex gap-4 border-b">
                    {['price', 'prediction', 'volume'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 ${activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                    : 'text-gray-500'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <div className="h-[400px]">
                    {activeTab === 'price' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.historicalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Harga']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#2563eb"
                                    dot={false}
                                    name="Harga"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'prediction' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.predictionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Prediksi']}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="prediction"
                                    stroke="#10b981"
                                    fill="#10b98133"
                                    name="Prediksi Harga"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'volume' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.historicalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    formatter={(value: number) => [value.toLocaleString(), 'Volume']}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf633"
                                    name="Volume Perdagangan"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}