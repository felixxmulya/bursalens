export interface StockData {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    historicalData: {
        date: string;
        price: number;
        prediction: number;
    }[];
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const stockDatabase: Record<string, StockData> = {
    'BBCA': {
        symbol: 'BBCA',
        name: 'Bank Central Asia Tbk',
        currentPrice: 9450,
        change: 2.5,
        historicalData: [
            { date: '2024-01', price: 8700, prediction: 8800 },
            { date: '2024-02', price: 8900, prediction: 9000 },
            { date: '2024-03', price: 9200, prediction: 9400 },
            { date: '2024-04', price: 9450, prediction: 9800 },
            { date: '2024-05', price: 0, prediction: 10200 },
            { date: '2024-06', price: 0, prediction: 10500 },
        ]
    },
    'TLKM': {
        symbol: 'TLKM',
        name: 'Telkom Indonesia Tbk',
        currentPrice: 3840,
        change: -1.2,
        historicalData: [
            { date: '2024-01', price: 3600, prediction: 3700 },
            { date: '2024-02', price: 3750, prediction: 3800 },
            { date: '2024-03', price: 3800, prediction: 3900 },
            { date: '2024-04', price: 3840, prediction: 4000 },
            { date: '2024-05', price: 0, prediction: 4200 },
            { date: '2024-06', price: 0, prediction: 4400 },
        ]
    }
};