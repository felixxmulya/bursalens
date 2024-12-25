import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Fundamentals {
    marketCap: number | null;
    sector: string | null;
    industry: string | null;
    netProfitMargin: number | null;
    ROE: number | null;
    ROA: number | null;
    PE: number | null;
    PB: number | null;
    dividendYield: number | null;
    fcfGrowth: number | null;
    currentRatio: number | null;
}

interface TechnicalMetrics {
    sma50: number;
    sma200: number;
    priceToSMA50: number;
    priceToSMA200: number;
    volumeAvg20: number;
    volatility20: number;
}

interface ModelMetrics {
    mape: number;
    r2_score: number;
    directional_accuracy: number;
    rmse: number;
    threshold_accuracy: number;
}

interface StockResponse {
    status: string;
    data: {
        name: string;
        currentPrice: number;
        historicalData: Array<{
            date: string;
            price: number;
            volume: number;
        }>;
        predictionData: Array<{
            date: string;
            prediction: number;
        }>;
        fundamentals: Fundamentals;
        technicalMetrics: TechnicalMetrics;
        modelMetrics: ModelMetrics;
    };
}

export const stockData = async (symbol: string) => {
    try {
        const response = await axios.get<StockResponse>(`${API_URL}/stock/${symbol}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            throw new Error(`Failed to fetch stock data: ${axiosError.response.status}`);
        } else if (axiosError.request) {
            throw new Error('No response received from server');
        } else {
            throw new Error('Error setting up the request');
        }
    }
};