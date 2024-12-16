export interface StockData {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    historicalData: {
        date: string;
        price: number;
        prediction: number;
        volume: number;
        sma20: number | null;
        rsi: number | null;
    }[];
    technicalIndicators: {
        lastRSI: number;
        lastMACD: number;
        lastSMA20: number;
    };
}