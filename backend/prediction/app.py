from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import RobustScaler
from datetime import timedelta
import ta
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.metrics import mean_absolute_percentage_error, r2_score
import math

app = Flask(__name__)
CORS(app)

DX_STOCKS = {
    'BBCA': 'Bank Central Asia',
    'BBRI': 'Bank Rakyat Indonesia',
    'BMRI': 'Bank Mandiri',
    'TLKM': 'Telkom Indonesia',
    'ASII': 'Astra International',
    'UNVR': 'Unilever Indonesia',
    'ICBP': 'Indofood CBP Sukses Makmur',
    'HMSP': 'HM Sampoerna',
    'GGRM': 'Gudang Garam',
    'KLBF': 'Kalbe Farma',
    'INDF': 'Indofood Sukses Makmur',
    'PGAS': 'Perusahaan Gas Negara',
    'PTBA': 'Bukit Asam',
    'ADRO': 'Adaro Energy',
    'ANTM': 'Aneka Tambang',
    'BBNI': 'Bank Negara Indonesia',
    'ERAA': 'Erajaya Swasembada',
    'JSMR': 'Jasa Marga',
    'MNCN': 'Media Nusantara Citra',
    'SMGR': 'Semen Indonesia',
    'TINS': 'Timah',
    'UNTR': 'United Tractors',
    'WIKA': 'Wijaya Karya',
}

class StockPredictor:
    def __init__(self):
        self.scaler = RobustScaler()
        self.lookback_period = 30
        self.model = None
        self.validation_split = 0.2
        self.min_training_size = 100
        self.last_scale_params = None

    def create_model(self, input_shape):
        """Create LSTM model architecture"""
        model = Sequential([
            LSTM(units=50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(units=50, return_sequences=False),
            Dropout(0.2),
            Dense(units=1)
        ])
        
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
        return model

    def add_features(self, df):
        """Create technical indicators for LSTM input"""
        df = df.copy()
        
        # Price-based features
        df['Returns'] = df['Close'].pct_change()
        df['SMA20'] = df['Close'].rolling(window=20).mean()
        df['SMA50'] = df['Close'].rolling(window=50).mean()
        
        # Momentum indicators
        df['RSI'] = ta.momentum.rsi(df['Close'])
        df['ROC'] = ta.momentum.roc(df['Close'])
        
        # Trend indicators
        df['MACD'] = ta.trend.macd_diff(df['Close'])
        
        # Volatility indicators
        bollinger = ta.volatility.BollingerBands(df['Close'])
        df['BB_width'] = (bollinger.bollinger_hband() - bollinger.bollinger_lband()) / df['Close']
        
        # Volume features
        df['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
        df['Volume_Ratio'] = df['Volume'] / df['Volume_SMA']
        
        return df.ffill().fillna(0)

    def prepare_data(self, df):
        """Prepare data for LSTM training"""
        try:
            data = self.add_features(df)
            
            feature_columns = ['Close', 'Returns', 'SMA20', 'SMA50', 'RSI', 'ROC', 
                             'MACD', 'BB_width', 'Volume_Ratio']
            
            # Ensure all required columns exist
            for col in feature_columns:
                if col not in data.columns:
                    print(f"Missing column: {col}")
                    return None, None, None
            
            # Scale the features
            scaled_data = self.scaler.fit_transform(data[feature_columns])
            
            X, y = [], []
            for i in range(self.lookback_period, len(scaled_data)):
                X.append(scaled_data[i-self.lookback_period:i])
                y.append(scaled_data[i, 0])  # Predict the scaled closing price
            
            if len(X) < self.min_training_size:
                print(f"Insufficient data: {len(X)} samples, need at least {self.min_training_size}")
                return None, None, None
            
            self.last_scale_params = {
                'n_features': len(feature_columns),
                'feature_columns': feature_columns
            }
                
            return np.array(X), np.array(y), feature_columns
            
        except Exception as e:
            print(f"Error in prepare_data: {str(e)}")
            return None, None, None

    def train_model(self, df):
        """Train LSTM model with prepared data"""
        try:
            X, y, feature_columns = self.prepare_data(df)
            
            if X is None:
                raise ValueError("Failed to prepare data")
            
            if len(X) < self.min_training_size:
                raise ValueError(f"Insufficient data: {len(X)} samples, need at least {self.min_training_size}")
            
            # Create and train the model
            self.model = self.create_model(input_shape=(X.shape[1], X.shape[2]))
            
            # Split into training and validation sets
            split_idx = int(len(X) * (1 - self.validation_split))
            X_train, X_val = X[:split_idx], X[split_idx:]
            y_train, y_val = y[:split_idx], y[split_idx:]
            
            # Train the model
            self.model.fit(
                X_train, y_train,
                validation_data=(X_val, y_val),
                epochs=50,
                batch_size=32,
                verbose=1
            )
            
            return True
            
        except Exception as e:
            print(f"Error in train_model: {str(e)}")
            return False

    def predict_future(self, data, days=30):
        """Generate future predictions using LSTM"""
        try:
            if len(data) < self.min_training_size + self.lookback_period:
                print(f"Warning: Limited data available. Predictions may be less accurate.")
            
            if self.model is None:
                if not self.train_model(data):
                    raise ValueError("Failed to train model")
            
            # Prepare the most recent data for prediction
            X, _, feature_columns = self.prepare_data(data)
            if X is None:
                raise ValueError("Failed to prepare prediction data")
            
            # Get the last sequence
            last_sequence = X[-1:]
            
            predictions = []
            current_sequence = last_sequence.copy()
            
            for _ in range(days):
                # Predict next value
                pred = self.model.predict(current_sequence, verbose=0)
                scaled_pred = pred[0][0]
                predictions.append(scaled_pred)
                
                # Create a new row with all features
                # We'll use the predicted value for 'Close' and repeat the last known values for other features
                new_row = np.zeros((1, self.last_scale_params['n_features']))
                new_row[0, 0] = scaled_pred  # Set predicted Close price
                new_row[0, 1:] = current_sequence[0, -1, 1:]  # Copy other features from last timestep
                
                # Update the sequence by removing the first timestep and adding the new prediction
                current_sequence = np.concatenate([
                    current_sequence[0, 1:], 
                    new_row
                ]).reshape(1, self.lookback_period, self.last_scale_params['n_features'])
            
            # Prepare for inverse transform
            predictions = np.array(predictions).reshape(-1, 1)
            dummy_features = np.zeros((len(predictions), self.last_scale_params['n_features'] - 1))
            full_scaled_predictions = np.hstack([predictions, dummy_features])
            
            # Inverse transform to get actual prices
            actual_predictions = self.scaler.inverse_transform(full_scaled_predictions)[:, 0]
            
            return actual_predictions.reshape(-1, 1)
            
        except Exception as e:
            print(f"Error in predict_future: {str(e)}")
            return None

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Fetch historical data - increased to 2 years for more training data
        stock = yf.Ticker(f"{symbol}.JK")
        hist_data = stock.history(period="2y")
        
        if hist_data.empty:
            return jsonify({
                'status': 'error',
                'message': 'No data found for this symbol'
            }), 404

        # Get predictions
        predictions = predictor.predict_future(hist_data)
        if predictions is None:
            raise ValueError("Failed to generate predictions")
        
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
            'volume': int(row['Volume'])
        } for index, row in hist_data.iterrows()]

        # Add predictions
        prediction_data = [{
            'date': date.strftime('%Y-%m-%d'),
            'prediction': int(pred[0]),
        } for date, pred in zip(future_dates, predictions)]

        return jsonify({
            'status': 'success',
            'data': {
                'name': symbol,
                'currentPrice': int(hist_data['Close'].iloc[-1]),
                'historicalData': historical_data,
                'predictionData': prediction_data
            }
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

predictor = StockPredictor()

if __name__ == '__main__':
    app.run(debug=True, port=5001)