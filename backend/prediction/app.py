from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, GRU
from datetime import datetime, timedelta
import ta

app = Flask(__name__)

CORS(app, resources={
    r"/*": {  # Match all routes instead of just /stock/*
        "origins": ["http://localhost:3000"],  # Explicitly allow your Next.js development server
        "methods": ["GET", "POST", "OPTIONS"],  # Allow specific HTTP methods
        "allow_headers": ["Content-Type", "Authorization"]  # Allow specific headers
    }
})



IDX_STOCKS = {
    'BBCA': 'Bank Central Asia',
    'BBRI': 'Bank Rakyat Indonesia',
    'BMRI': 'Bank Mandiri',
    'TLKM': 'Telkom Indonesia',
    'ASII': 'Astra International',
}

class EnhancedStockPredictor:
    def __init__(self):
        self.scaler = MinMaxScaler()
        self.lookback_period = 60
        self.model = None

    def prepare_technical_features(self, df):
        """Calculate comprehensive technical indicators"""
        # Trend Indicators
        df['SMA_20'] = ta.trend.sma_indicator(df['Close'], window=20)
        df['EMA_20'] = ta.trend.ema_indicator(df['Close'], window=20)
        df['MACD'] = ta.trend.macd_diff(df['Close'])
        
        # Momentum Indicators
        df['RSI'] = ta.momentum.rsi(df['Close'])
        df['Stoch'] = ta.momentum.stoch(df['High'], df['Low'], df['Close'])
        df['ROC'] = ta.momentum.roc(df['Close'])
        
        # Volatility Indicators
        bb = ta.volatility.BollingerBands(df['Close'])
        df['BB_upper'] = bb.bollinger_hband()
        df['BB_lower'] = bb.bollinger_lband()
        df['ATR'] = ta.volatility.average_true_range(df['High'], df['Low'], df['Close'])

        return df.fillna(method='ffill')

    def create_model(self, input_shape):
        model = Sequential([
            LSTM(100, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            GRU(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(50, activation='relu'),
            Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def prepare_data(self, data):
        # Scale the data
        scaled_data = self.scaler.fit_transform(data['Close'].values.reshape(-1, 1))
        
        X, y = [], []
        for i in range(self.lookback_period, len(scaled_data)):
            X.append(scaled_data[i-self.lookback_period:i, 0])
            y.append(scaled_data[i, 0])
            
        return np.array(X), np.array(y)

    def train_model(self, data):
        X, y = self.prepare_data(data)
        
        # Split data for validation
        train_size = int(len(X) * 0.8)
        X_train = X[:train_size]
        y_train = y[:train_size]
        
        # Create and train model
        self.model = self.create_model((X.shape[1], 1))
        self.model.fit(
            X_train, 
            y_train, 
            epochs=50, 
            batch_size=32, 
            validation_split=0.1, 
            verbose=0
        )
        
        return X, y

    def predict_future(self, data, days=30):
        if self.model is None:
            self.train_model(data)
            
        # Prepare last sequence
        scaled_data = self.scaler.transform(data['Close'].values.reshape(-1, 1))
        last_sequence = scaled_data[-self.lookback_period:]
        
        # Generate predictions
        future_predictions = []
        current_sequence = last_sequence.copy()
        
        for _ in range(days):
            next_pred = self.model.predict(current_sequence.reshape(1, self.lookback_period, 1))
            future_predictions.append(next_pred[0, 0])
            
            # Update sequence
            current_sequence = np.roll(current_sequence, -1)
            current_sequence[-1] = next_pred
            
        return self.scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))

predictor = EnhancedStockPredictor()

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Fetch stock data
        stock = yf.Ticker(f"{symbol}.JK")
        hist_data = stock.history(period="2y")  # Using 2 years of data for better training
        
        if hist_data.empty:
            return jsonify({
                'status': 'error',
                'message': 'No data found for this symbol'
            }), 404

        # Add technical indicators
        hist_data = predictor.prepare_technical_features(hist_data)

        # Train model and get predictions
        future_prices = predictor.predict_future(hist_data)
        
        # Calculate price change
        price_change = ((hist_data['Close'].iloc[-1] - hist_data['Close'].iloc[-2]) / 
                       hist_data['Close'].iloc[-2]) * 100

        # Generate future dates
        last_date = hist_data.index[-1]
        future_dates = [last_date + timedelta(days=x) for x in range(1, 31)]

        # Prepare historical data
        historical_data = [{
            'date': index.strftime('%Y-%m-%d'),
            'price': int(row['Close']),
            'prediction': 0,
            'volume': int(row['Volume']),
            'sma20': int(row['SMA_20']) if not np.isnan(row['SMA_20']) else None,
            'rsi': int(row['RSI']) if not np.isnan(row['RSI']) else None,
        } for index, row in hist_data.iterrows()]

        # Add future predictions
        prediction_data = [{
            'date': date.strftime('%Y-%m-%d'),
            'price': 0,
            'prediction': int(price[0]),
            'volume': 0,
            'sma20': None,
            'rsi': None
        } for date, price in zip(future_dates, future_prices)]

        return jsonify({
            'status': 'success',
            'data': {
                'symbol': symbol,
                'name': IDX_STOCKS.get(symbol, 'Unknown'),
                'currentPrice': int(hist_data['Close'].iloc[-1]),
                'change': int(price_change),
                'historicalData': historical_data + prediction_data,
                'technicalIndicators': {
                    'lastRSI': int(hist_data['RSI'].iloc[-1]),
                    'lastMACD': int(hist_data['MACD'].iloc[-1]),
                    'lastSMA20': int(hist_data['SMA_20'].iloc[-1])
                }
            }
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)