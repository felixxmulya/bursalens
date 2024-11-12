"use client";

import { useState } from "react";

interface Stock {
  name: string;
  symbol: string;
}

const blueChipStocks: Stock[] = [
  { name: "Bank Central Asia", symbol: "BBCA.JK" },
  { name: "Bank Rakyat Indonesia", symbol: "BBRI.JK" },
  { name: "Telkom Indonesia", symbol: "TLKM.JK" },
];

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<string>(blueChipStocks[0].symbol);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [realTimePrice, setRealTimePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?symbol=${selectedStock}`);
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        setPredictedPrice(data.predicted_price);
        setRealTimePrice(data.real_time_price);
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Failed to fetch prediction.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Stock Price Prediction</h1>
      <select
        className="p-2 mb-4 border"
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
      >
        {blueChipStocks.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name}
          </option>
        ))}
      </select>
      <button
        onClick={fetchPrediction}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Show Prediction"}
      </button>

      {realTimePrice !== null && (
        <h2 className="mt-6 text-xl">Real-Time Price: Rp {realTimePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      )}

      {predictedPrice !== null && (
        <h2 className="mt-2 text-xl">Predicted Price: Rp {predictedPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      )}
    </div>
  );
}