import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

# List of blue-chip Indonesian stocks
blue_chip_stocks = [
    {"name": "Bank Central Asia", "symbol": "BBCA.JK"},
    {"name": "Bank Rakyat Indonesia", "symbol": "BBRI.JK"},
    {"name": "Telkom Indonesia", "symbol": "TLKM.JK"},
]

# Function to create sequences
def create_sequences(data, seq_length):
    x, y = [], []
    for i in range(seq_length, len(data)):
        x.append(data[i-seq_length:i, 0])
        y.append(data[i, 0])
    return np.array(x), np.array(y)

# Training parameters
seq_length = 60
epochs = 50
batch_size = 32

for stock in blue_chip_stocks:
    symbol = stock["symbol"]
    print(f"Training model for {stock['name']} ({symbol})")

    # Fetch stock data
    data = yf.download(symbol, start="2010-01-01", end=datetime.now().strftime('%Y-%m-%d'))

    # Preprocess data
    close_prices = data[['Close']].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)

    # Create sequences
    x, y = create_sequences(scaled_data, seq_length)

    # Split data into training and testing sets (80% train, 20% test)
    train_size = int(len(x) * 0.8)
    x_train, y_train = x[:train_size], y[:train_size]
    x_test, y_test = x[train_size:], y[train_size:]

    # Reshape data for LSTM input
    x_train = x_train.reshape(-1, seq_length, 1)
    x_test = x_test.reshape(-1, seq_length, 1)

    # Build LSTM model
    model = Sequential([
        LSTM(100, return_sequences=True, input_shape=(seq_length, 1)),
        Dropout(0.2),
        LSTM(100, return_sequences=False),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train the model
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(x_test, y_test))

    # Save the model
    model_filename = f"lstm_model_{symbol}.h5"
    model.save(model_filename)
    print(f"Model for {stock['name']} saved as '{model_filename}'")

print("All models trained and saved.")