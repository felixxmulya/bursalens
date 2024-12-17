import axios, { AxiosError } from 'axios';

const API_URL = 'http://127.0.0.1:5001';

interface StockResponse {
    status: string;
    data: {
        name: string;
        currentPrice: number;
        change: number;
        historicalData: Array<{
            date: string;
            price: number;
            volume: number;
        }>;
        predictionData: Array<{
            date: string;
            prediction: number;
        }>;
    };
}

export const stockData = async (symbol: string) => {
    try {
        const response = await axios.get<StockResponse>(`${API_URL}/stock/${symbol}`);
        console.log('response:', response);
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