from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load the trained LSTM model
model = load_model("lstm_model.h5")

# Helper function to create sequences
def create_sequences(data, seq_length):
    x = []
    for i in range(seq_length, len(data)):
        x.append(data[i-seq_length:i, 0])
    return np.array(x)

@app.route("/predict", methods=["GET"])
def predict():
    symbol = request.args.get("symbol", "BBCA.JK")

    # Fetch historical stock data up to today's date
    end_date = datetime.now().strftime("%Y-%m-%d")
    try:
        data = yf.download(symbol, start="2015-01-01", end=end_date)
        if data.empty:
            return jsonify({"error": "Invalid stock symbol or no data available"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Preprocess data
    close_prices = data[['Close']].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)

    # Create sequences for prediction
    seq_length = 60
    x_test = create_sequences(scaled_data[-seq_length*2:], seq_length)
    x_test = x_test.reshape(-1, seq_length, 1)

    # Make prediction using the latest sequence
    prediction = model.predict(x_test[-1].reshape(1, seq_length, 1))
    predicted_price = scaler.inverse_transform(prediction)[0][0]

    # Fetch real-time stock price
    try:
        real_time_data = yf.download(symbol, period='1d', interval='1m')
        if real_time_data.empty:
            return jsonify({"error": "Unable to fetch real-time data"}), 500
        real_time_price = real_time_data['Close'].iloc[-1]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Format the prices to two decimal places
    predicted_price = round(float(predicted_price), 2)
    real_time_price = round(float(real_time_price), 2)

    # Return prediction and real-time price
    response = {
        "predicted_price": predicted_price,
        "real_time_price": real_time_price
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
