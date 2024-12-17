import { PredictionData, ChatMessage } from './../interface/prediction';

export const predictionData: PredictionData[] = [
  { date: '2024-01', actual: 65, predicted: 62 },
  { date: '2024-02', actual: 72, predicted: 70 },
  { date: '2024-03', actual: 78, predicted: 75 },
  { date: '2024-04', actual: 85, predicted: 82 },
  { date: '2024-05', actual: 89, predicted: 88 },
  { date: '2024-06', actual: 95, predicted: 92 }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Welcome to the prediction dashboard! How can I help you today?',
    sender: 'system',
    timestamp: '09:00 AM'
  },
  {
    id: '2',
    text: 'I noticed the predictions are quite accurate for May.',
    sender: 'user',
    timestamp: '09:01 AM'
  },
  {
    id: '3',
    text: 'Yes, our model has been performing well. The error margin is less than 2%.',
    sender: 'system',
    timestamp: '09:02 AM'
  }
];