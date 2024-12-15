// app/prediction/components/AnalysisSection.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData } from './stock';

interface AnalysisSectionProps {
    selectedStock: StockData | null;
    predictionTimeframe: '1m' | '3m';
    setPredictionTimeframe: (timeframe: '1m' | '3m') => void;
}

export default function AnalysisSection({ 
    selectedStock, 
    predictionTimeframe, 
    setPredictionTimeframe 
}: AnalysisSectionProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                    {selectedStock ? `${selectedStock.symbol} Analysis` : 'Market Analysis'}
                </h2>
                {selectedStock && (
                    <p className="text-gray-500">{selectedStock.name}</p>
                )}
            </div>

            {selectedStock && (
                <>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-gray-500">Current Price</p>
                                <p className="text-2xl font-bold">
                                    Rp {selectedStock.currentPrice.toLocaleString()}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-full ${
                                selectedStock.change >= 0 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change}%
                            </div>
                        </div>

                        <div className="flex space-x-2 mb-4">
                            <button
                                onClick={() => setPredictionTimeframe('1m')}
                                className={`px-4 py-2 rounded-lg ${
                                    predictionTimeframe === '1m'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                1 Month
                            </button>
                            <button
                                onClick={() => setPredictionTimeframe('3m')}
                                className={`px-4 py-2 rounded-lg ${
                                    predictionTimeframe === '3m'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                                3 Months
                            </button>
                        </div>
                    </div>

                    <div className="h-[300px] mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selectedStock.historicalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#2563eb" 
                                    name="Price"
                                    strokeWidth={2}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="prediction" 
                                    stroke="#16a34a" 
                                    strokeDasharray="5 5" 
                                    name="Prediction"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                            <FontAwesomeIcon icon={faChartLine} className="text-blue-600 mr-2" />
                            <span className="font-medium">Prediction Target</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                            Rp {selectedStock.historicalData[5].prediction.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Expected in 3 months
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}