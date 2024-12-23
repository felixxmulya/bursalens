import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartsProps {
    activeTab: string;
    timeRange: string;
    handleTimeRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    filteredHistoricalData: any;
    data: any;
    setActiveTab: (tab: string) => void;
}

export default function Charts({ activeTab, timeRange, handleTimeRangeChange, filteredHistoricalData, data, setActiveTab }: ChartsProps) {
    return (
        <div>
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
                {/* Time Range Selector */}
                {activeTab === 'price' && (
                    <div className="mb-5">
                        <label htmlFor="timeRange" className="block text-gray-700 text-sm font-medium">Select Time Range:</label>
                        <select
                            id="timeRange"
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                        >
                            <option value="overall">Overall</option>
                            <option value="3y">Last 3 Years</option>
                            <option value="2y">Last 2 Years</option>
                            <option value="1y">Last 1 Year</option>
                            <option value="6m">Last 6 Months</option>
                            <option value="3m">Last 3 Months</option>
                            <option value="1m">Last 1 Month</option>
                        </select>
                    </div>
                )}
                <div className="h-[400px]">
                    {activeTab === 'price' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={filteredHistoricalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                />
                                <YAxis domain={['dataMin - 200', 'dataMax + 500']} />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Price']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#2563eb"
                                    dot={false}
                                    name="Price"
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
                                <YAxis domain={['dataMin - 500', 'dataMax + 200']} />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('id-ID')}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Prediction']}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="prediction"
                                    stroke="#10b981"
                                    fill="#10b98133"
                                    name="Prediction Price"
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
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf633"
                                    name="Market Volume"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}