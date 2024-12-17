export type PredictionData = {
  date: string;
  prediction: number;
};

export type historicalData = {
  date: string;
  price: number;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "system";
  timestamp: string;
};
