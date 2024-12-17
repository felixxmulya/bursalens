from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import yfinance as yf
from datetime import timedelta
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

app = Flask(__name__)
CORS(app)

IDX_STOCKS = {
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

def get_stock_data(symbol, period='2y'):
    """Fetch stock data from Yahoo Finance"""
    stock = yf.Ticker(f"{symbol}.JK")
    data = stock.history(period=period)
    return data

def add_technical_indicators(df):
    """Add technical indicators to the dataframe"""
    df['MA20'] = df['Close'].rolling(window=20).mean()
    df['MA50'] = df['Close'].rolling(window=50).mean()
    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    exp1 = df['Close'].ewm(span=12, adjust=False).mean()
    exp2 = df['Close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = exp1 - exp2
    return df

def prepare_data(data, lookback=60):
    """Prepare data for LSTM model"""
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data['Close'].values.reshape(-1, 1))
    X, y = [], []
    for i in range(lookback, len(scaled_data)):
        X.append(scaled_data[i-lookback:i, 0])
        y.append(scaled_data[i, 0])
    X, y = np.array(X), np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    return X, y, scaler

def create_model(input_shape):
    """Create LSTM model"""
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(50),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    return model

@app.route('/stock/<symbol>', methods=['GET'])
def predict_stock(symbol):
    try:
        data = get_stock_data(symbol)
        if data.empty:
            return jsonify({'status': 'error', 'message': 'No data found for this symbol'}), 404
        data = add_technical_indicators(data)
        X, y, scaler = prepare_data(data)
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        model = create_model((X.shape[1], 1))
        model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1, verbose=1)
        predictions = model.predict(X_test)
        predictions = scaler.inverse_transform(predictions)
        actual = scaler.inverse_transform(y_test.reshape(-1, 1))
        last_sequence = X[-1]
        future_days = 30
        future_predictions = []
        for _ in range(future_days):
            next_pred = model.predict(last_sequence.reshape(1, X.shape[1], 1))
            future_predictions.append(next_pred[0, 0])
            last_sequence = np.roll(last_sequence, -1)
            last_sequence[-1] = next_pred
        future_predictions = scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1))
        last_date = data.index[-1]
        future_dates = [last_date + timedelta(days=x) for x in range(1, future_days + 1)]
        prediction_data = [{'date': date.strftime('%Y-%m-%d'), 'prediction': int(pred[0])} for date, pred in zip(future_dates, future_predictions)]
        
        # Prepare historical data
        historical_data = [{'date': index.strftime('%Y-%m-%d'), 'price': int(row['Close'])} for index, row in data.iterrows()]
        
        return jsonify({'status': 'success', 'predictions': prediction_data, 'historical_data': historical_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5002)