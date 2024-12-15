# app.py
from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Sample stock list
STOCKS = {
    'BBCA': 'Bank Central Asia',
    'BBRI': 'Bank Rakyat Indonesia',
    'TLKM': 'Telkom Indonesia'
}

@app.route('/stock', methods=['GET'])
def get_stocks():
    return jsonify(STOCKS)

@app.route('/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        # Get stock data
        stock = yf.Ticker(f"{symbol}.JK")
        hist = stock.history(period="6mo")
        
        # Calculate simple moving averages
        hist['MA20'] = hist['Close'].rolling(window=20).mean()
        hist['MA50'] = hist['Close'].rolling(window=50).mean()
        
        # Basic prediction (just for demo)
        last_price = hist['Close'].iloc[-1]
        prediction = last_price * (1 + np.random.uniform(-0.1, 0.1))
        
        return jsonify({
            'success': True,
            'data': {
                'symbol': symbol,
                'name': STOCKS.get(symbol, 'Unknown'),
                'currentPrice': float(last_price),
                'prediction': float(prediction),
                'history': [
                    {
                        'date': index.strftime('%Y-%m-%d'),
                        'price': float(row['Close']),
                        'volume': float(row['Volume'])
                    }
                    for index, row in hist.iterrows()
                ]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)