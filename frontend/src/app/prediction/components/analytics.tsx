import React, { useState, useEffect } from 'react';
import { stockData } from '@/app/api/stock';
import Loading from '@/app/components/loading';
import Error from '@/app/components/error';
import Info from '@/app/prediction/components/stock/info';
import Charts from '@/app/prediction/components/stock/chart';
import { faChartBar, faExchangeAlt, faPercent, faChartLine } from '@fortawesome/free-solid-svg-icons';

interface AnalyticsProps {
    symbol: string;
}

export default function Analytics({ symbol }: AnalyticsProps) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('price');
    const [timeRange, setTimeRange] = useState('overall');

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

    if (loading) return <Loading />;
    if (error || !data) return <Error />;

    const keyMetrics = [
        {
            label: 'Market Cap',
            value: `Rp ${(data.fundamentals.marketCap / 1e12).toFixed(2)} T`,
            icon: faChartBar,
            color: 'text-blue-500'
        },
        {
            label: 'P/E Ratio',
            value: data.fundamentals.PE?.toFixed(2) || 'N/A',
            icon: faExchangeAlt,
            color: 'text-purple-500'
        },
        {
            label: 'ROA',
            value: data.fundamentals.ROA ? `${(data.fundamentals.ROA).toFixed(2)}%` : 'N/A',
            icon: faPercent,
            color: 'text-yellow-500'
        },
        {
            label: 'Dividend Yield',
            value: data.fundamentals.dividendYield ? `${(data.fundamentals.dividendYield).toFixed(2)}%` : 'N/A',
            icon: faChartLine,
            color: 'text-green-500'
        }
    ];

    const modelMetrics = [
        {
            label: 'MAPE',
            value: `${(data.modelMetrics.mape).toFixed(2)}%`,
            description: 'A measure of prediction accuracy in a forecasting model'
        },
        {
            label: 'R² Score',
            value: `${(data.modelMetrics.r2_score).toFixed(2)}`,
            description: 'Indicates how well the predicted values match the actual values'
        },
        {
            label: 'Directional Accuracy',
            value: `${(data.modelMetrics.directional_accuracy).toFixed(2)}%`,
            description: 'Measures the percentage of accurate directional predictions'
        }
    ];

    const filterDateTime = () => {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case '1m':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '3m':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6m':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '1y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case '2y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 2));
                break;
            case '3y':
                startDate = new Date(now.setFullYear(now.getFullYear() - 3));
                break;
            default:
                return data.historicalData;
        }

        return data.historicalData.filter((entry) => new Date(entry.date) >= startDate);
    };

    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeRange(e.target.value);
    };

    const filteredHistoricalData = filterDateTime();

    return (
        <div>
            <Info data={data} keyMetrics={keyMetrics} modelMetrics={modelMetrics} />
            <Charts
                activeTab={activeTab}
                timeRange={timeRange}
                handleTimeRangeChange={handleTimeRangeChange}
                filteredHistoricalData={filteredHistoricalData}
                data={data}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}