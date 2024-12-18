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
from tensorflow.keras.callbacks import EarlyStopping

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
            LSTM(units=100, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(units=70, return_sequences=False),
            Dropout(0.1),
            Dense(units=50),
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

            feature_columns = ['Close', 'Returns', 'SMA20', 'SMA50', 'RSI', 'ROC', 'MACD', 'BB_width', 'Volume_Ratio']

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

    def calculate_accuracy_metrics(self, y_true, y_pred):
        """Calculate various accuracy metrics for the predictions"""
        try:
            # Mean Absolute Percentage Error (MAPE)
            mape = mean_absolute_percentage_error(y_true, y_pred) * 100

            # R-squared score
            r2 = r2_score(y_true, y_pred)

            # Calculate directional accuracy
            actual_direction = np.sign(np.diff(y_true))
            pred_direction = np.sign(np.diff(y_pred))
            directional_accuracy = np.mean(actual_direction == pred_direction) * 100

            # Root Mean Squared Error (RMSE)
            rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))

            # Calculate percentage accuracy based on a threshold
            threshold = 0.02  # 2% threshold
            within_threshold = np.abs((y_true - y_pred) / y_true) <= threshold
            threshold_accuracy = np.mean(within_threshold) * 100

            return {
                'mape': round(mape, 2),
                'r2_score': round(r2 * 100, 2),
                'directional_accuracy': round(directional_accuracy, 2),
                'rmse': round(rmse, 2),
                'threshold_accuracy': round(threshold_accuracy, 2)
            }
        except Exception as e:
            print(f"Error calculating accuracy metrics: {str(e)}")
            return None


    def train_model(self, df):
        """Train LSTM model with prepared data and calculate accuracy metrics"""
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

            early_stopping = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)

            # Train the model
            self.model.fit(
                X_train, y_train,
                validation_data=(X_val, y_val),
                epochs=100,
                batch_size=32,
                verbose=1,
                callbacks=[early_stopping]
            )

            # Get predictions for validation set
            y_pred = self.model.predict(X_val)

            # Inverse transform the scaled values
            dummy_features = np.zeros((len(y_val), self.last_scale_params['n_features'] - 1))
            y_true_full = np.hstack([y_val.reshape(-1, 1), dummy_features])
            y_pred_full = np.hstack([y_pred, dummy_features])

            y_true_actual = self.scaler.inverse_transform(y_true_full)[:, 0]
            y_pred_actual = self.scaler.inverse_transform(y_pred_full)[:, 0]

            # Calculate accuracy metrics
            accuracy_metrics = self.calculate_accuracy_metrics(y_true_actual, y_pred_actual)
            self.last_accuracy = accuracy_metrics

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

    def calculate_fundamentals(self, ticker):
        """Calculate fundamental metrics for the stock"""
        try:
            # Get financial data
            info = ticker.info
            financials = ticker.financials
            balance_sheet = ticker.balance_sheet
            cash_flow = ticker.cashflow

            fundamentals = {}

            # Basic info
            fundamentals['marketCap'] = info.get('marketCap', None)
            fundamentals['sector'] = info.get('sector', None)
            fundamentals['industry'] = info.get('industry', None)

            # Profitability metrics
            if not financials.empty:
                latest_year = financials.columns[0]

                # Revenue and Profit metrics
                total_revenue = financials.loc['Total Revenue', latest_year] if 'Total Revenue' in financials.index else None
                net_income = financials.loc['Net Income', latest_year] if 'Net Income' in financials.index else None

                if total_revenue and net_income:
                    fundamentals['netProfitMargin'] = (net_income / total_revenue) * 100

                # ROE (Return on Equity)
                if not balance_sheet.empty and 'Total Stockholder Equity' in balance_sheet.index:
                    equity = balance_sheet.loc['Total Stockholder Equity', balance_sheet.columns[0]]
                    if equity and net_income:
                        fundamentals['ROE'] = (net_income / equity) * 100

                # ROA (Return on Assets)
                if not balance_sheet.empty and 'Total Assets' in balance_sheet.index:
                    assets = balance_sheet.loc['Total Assets', balance_sheet.columns[0]]
                    if assets and net_income:
                        fundamentals['ROA'] = (net_income / assets) * 100

            # Valuation metrics
            fundamentals['PE'] = info.get('trailingPE', None)
            fundamentals['PB'] = info.get('priceToBook', None)
            fundamentals['dividendYield'] = info.get('dividendYield', None)
            if fundamentals['dividendYield']:
                fundamentals['dividendYield'] *= 100  # Convert to percentage

            # Growth metrics
            if not cash_flow.empty and 'Free Cash Flow' in cash_flow.index:
                fcf_current = cash_flow.loc['Free Cash Flow', cash_flow.columns[0]]
                fcf_previous = cash_flow.loc['Free Cash Flow', cash_flow.columns[1]]
                if fcf_current and fcf_previous:
                    fundamentals['fcfGrowth'] = ((fcf_current - fcf_previous) / abs(fcf_previous)) * 100

            # Liquidity metrics
            if not balance_sheet.empty:
                current_assets = balance_sheet.loc['Total Current Assets', balance_sheet.columns[0]] if 'Total Current Assets' in balance_sheet.index else None
                current_liabilities = balance_sheet.loc['Total Current Liabilities', balance_sheet.columns[0]] if 'Total Current Liabilities' in balance_sheet.index else None

                if current_assets and current_liabilities:
                    fundamentals['currentRatio'] = current_assets / current_liabilities

            # Format numbers
            for key, value in fundamentals.items():
                if isinstance(value, (float, np.float64)):
                    fundamentals[key] = round(value, 2)
                elif isinstance(value, (int, np.int64)):
                    fundamentals[key] = int(value)

            return fundamentals

        except Exception as e:
            print(f"Error calculating fundamentals: {str(e)}")
            return {}

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Fetch historical data - increased to 5 years for more training data
        stock = yf.Ticker(f"{symbol}.JK")
        hist_data = stock.history(period="5y")

        if hist_data.empty:
            return jsonify({
                'status': 'error',
                'message': 'No data found for this symbol'
            }), 404

        # Get predictions
        predictions = predictor.predict_future(hist_data)
        if predictions is None:
            raise ValueError("Failed to generate predictions")

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

        # Calculate fundamental metrics
        fundamentals = predictor.calculate_fundamentals(stock)

        # Calculate technical metrics
        latest_price = float(hist_data['Close'].iloc[-1])
        sma_50 = float(hist_data['Close'].rolling(window=50).mean().iloc[-1])
        sma_200 = float(hist_data['Close'].rolling(window=200).mean().iloc[-1])

        technical_metrics = {
            'sma50': sma_50,
            'sma200': sma_200,
            'priceToSMA50': (latest_price / sma_50 - 1) * 100,
            'priceToSMA200': (latest_price / sma_200 - 1) * 100,
            'volumeAvg20': int(hist_data['Volume'].rolling(window=20).mean().iloc[-1]),
            'volatility20': float(hist_data['Close'].pct_change().std() * np.sqrt(252) * 100)
        }

        return jsonify({
            'status': 'success',
            'data': {
                'name': symbol,
                'currentPrice': int(hist_data['Close'].iloc[-1]),
                'historicalData': historical_data,
                'predictionData': prediction_data,
                'fundamentals': fundamentals,
                'modelMetrics': predictor.last_accuracy,
                'technicalMetrics': technical_metrics,
            }
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

predictor = StockPredictor()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)