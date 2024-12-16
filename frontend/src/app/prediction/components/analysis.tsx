import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faArrowUp, faArrowDown, faChartArea } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { StockData } from '@/app/prediction/lib/stock';
import { formatPrice } from '@/app/prediction/lib/utils';

interface Props {
    selectedStock: StockData | null;
}


export default function Analysis({ selectedStock }: Props) {

    
    const placeholderData = Array.from({ length: 50 }, (_, i) => ({
        date: new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 0,
        prediction: 0
    }));

    const data = useMemo(() => {
        if (!selectedStock) return placeholderData;
        return selectedStock.historicalData.slice(-50);
    }, [selectedStock]);

    const predictedChange = useMemo(() => {
        if (!selectedStock) return 0;
        const latestPrice = selectedStock.currentPrice;
        const predictedPrice = selectedStock.historicalData[selectedStock.historicalData.length - 1].prediction;
        return ((predictedPrice - latestPrice) / latestPrice) * 100;
    }, [selectedStock]);

    return (
        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartArea} className="text-blue-600" />
                    {selectedStock ? `${selectedStock.symbol} Analysis` : 'Stock Analysis'}
                </h2>
                <p className="text-gray-500 mt-1">
                    {selectedStock ? selectedStock.name : 'Select a stock to view analysis'}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Current Price Card */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Current Price</p>
                        {selectedStock && (
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                                selectedStock.change >= 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                <FontAwesomeIcon 
                                    icon={selectedStock.change >= 0 ? faArrowUp : faArrowDown} 
                                    className="mr-1 h-3 w-3"
                                />
                                {selectedStock.change}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold mt-2">
                        {selectedStock ? formatPrice(selectedStock.currentPrice) : '—'}
                    </p>
                </div>

                {/* Technical Indicators Card */}
                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-500 text-sm mb-2">Technical Indicators</p>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">RSI</span>
                            <span className="text-sm font-semibold">
                                {selectedStock ? selectedStock.technicalIndicators.lastRSI : '—'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">MACD</span>
                            <span className="text-sm font-semibold">
                                {selectedStock ? selectedStock.technicalIndicators.lastMACD : '—'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">SMA20</span>
                            <span className="text-sm font-semibold">
                                {selectedStock ? formatPrice(selectedStock.technicalIndicators.lastSMA20) : '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prediction Card */}
                <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faChartLine} className="text-blue-600 mr-2" />
                            <span className="font-medium">Predicted Price</span>
                        </div>
                        {selectedStock && (
                            <div className={`px-3 py-1 rounded-full text-sm ${
                                predictedChange >= 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {Math.abs(predictedChange).toFixed(2)}%
                            </div>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                        {selectedStock 
                            ? formatPrice(selectedStock.historicalData[selectedStock.historicalData.length - 1].prediction)
                            : '—'
                        }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Predicted price in 30 days
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                        />
                        <YAxis 
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                            tickFormatter={(value) => `${(value/1000)}K`}
                        />
                        <Tooltip 
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white p-4 border rounded-lg shadow-lg">
                                            <p className="text-sm text-gray-600">{label}</p>
                                            {payload.map((item: any, index: number) => (
                                                <p key={index} className="text-sm font-semibold" style={{ color: item.color }}>
                                                    {item.name}: {formatPrice(item.value)}
                                                </p>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        {selectedStock && (
                            <ReferenceLine
                                y={selectedStock.currentPrice}
                                stroke="#666"
                                strokeDasharray="3 3"
                                label={{ 
                                    position: "left",
                                    fill: "#666",
                                    fontSize: 12
                                }}
                            />
                        )}
                        <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#2563eb" 
                            name="Historical Price"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="prediction" 
                            stroke="#16a34a" 
                            strokeDasharray="5 5" 
                            name="30-Days Prediction"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}