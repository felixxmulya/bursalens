import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faCalendarAlt,
    faCheckCircle,
    faArrowTrendUp,
    faBullseye
} from '@fortawesome/free-solid-svg-icons';
import { PredictionData } from '../interface/prediction';
import Loading from '@/app/components/loading';

type AnalyticsProps = {
    data: PredictionData[];
    isLoading?: boolean;
};

export default function Analytics({ data, isLoading = false }: AnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('6m');

    if (isLoading) return <Loading />;

    const stats = [
        {
            title: 'Accuracy',
            value: '96.5%',
            subtext: 'Model Accuracy',
            icon: faCheckCircle,
            color: 'text-green-500'
        },
        {
            title: 'Average Error',
            value: '1.5%',
            subtext: 'Model Error',
            icon: faBullseye,
            color: 'text-red-500'
        },
        {
            title: 'Prediction Count',
            value: '100',
            subtext: 'Total Predictions',
            icon: faChartLine,
            color: 'text-blue-500'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        icon={faArrowTrendUp}
                        className="h-6 w-6 text-blue-600"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">Price Analysis & Predictions</h2>
                </div>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="h-4 w-4 text-gray-500"
                    />
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="1m">Last Month</option>
                        <option value="3m">Last 3 Months</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last Year</option>
                    </select>
                </div>
            </div>

            <div className='flex items-center gap-2 mb-6'>
                <h3>BBCA</h3>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon
                                icon={stat.icon}
                                className={`h-4 w-4 ${stat.color}`}
                            />
                            <h3 className="text-sm text-gray-600">{stat.title}</h3>
                        </div>
                        <div className="flex flex-col">
                            <span className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                            <span className="text-sm text-gray-500 mt-1">
                                {stat.subtext}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#666' }}
                        />
                        <YAxis
                            tick={{ fill: '#666' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number) => [`$${value}`, '']}
                            labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#2563eb"
                            name="Actual Price"
                            strokeWidth={2}
                            dot={{ fill: '#2563eb', r: 4 }}
                            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#16a34a"
                            name="Predicted Price"
                            strokeWidth={2}
                            dot={{ fill: '#16a34a', r: 4 }}
                            activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
                            strokeDasharray="5 5"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}