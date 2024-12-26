# 🚀 BursaLens - Indonesian Stock Market Prediction & News Analysis

An advanced stock market analysis platform combining deep learning LSTM predictions with real-time news scraping. Built for the Indonesian market (IDX), featuring comprehensive technical analysis, fundamental metrics, and news integration.

## ✨ Features

### 🤖 LSTM Stock Prediction
- **Advanced Neural Network Architecture**
  - Multi-layer LSTM with dropout layers
  - Sequence-based prediction (30-days lookback)
  - Dynamic feature engineering
  - Robust scaling and preprocessing
  - Early stopping for optimal training

- **Technical Indicators**
  - Moving Averages (SMA20, SMA50)
  - Relative Strength Index (RSI)
  - MACD (Moving Average Convergence Divergence)
  - Bollinger Bands
  - Rate of Change (ROC)
  - Volume Analysis

- **Fundamental Analysis**
  - Market Capitalization
  - P/E Ratio
  - ROE (Return on Equity)
  - ROA (Return on Assets)
  - Current Ratio
  - Free Cash Flow Growth
  - Dividend Yield

- **Model Performance Metrics**
  - MAPE (Mean Absolute Percentage Error)
  - R-squared Score
  - Directional Accuracy
  - RMSE (Root Mean Square Error)
  - Threshold Accuracy

### 📰 News Integration
- Real-time news scraping from Liputan6
- Market sentiment analysis
- Article categorization
- Image and media extraction
- Timestamp standardization

## 🧠 LSTM Model Architecture

### Data Preprocessing
```python
def prepare_data(self, df):
    # Feature Engineering
    features = [
        'Close', 'Returns', 'SMA20', 'SMA50',
        'RSI', 'ROC', 'MACD', 'BB_width',
        'Volume_Ratio'
    ]
    
    # Robust Scaling
    scaled_data = self.scaler.fit_transform(data[features])
    
    # Sequence Creation
    X, y = [], []
    for i in range(self.lookback_period, len(scaled_data)):
        X.append(scaled_data[i-self.lookback_period:i])
        y.append(scaled_data[i, 0])
```

### Model Structure
```python
def create_model(self, input_shape):
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
```

### Technical Indicators
```python
def add_features(self, df):
    # Price Features
    df['Returns'] = df['Close'].pct_change()
    df['SMA20'] = df['Close'].rolling(window=20).mean()
    df['SMA50'] = df['Close'].rolling(window=50).mean()

    # Momentum
    df['RSI'] = ta.momentum.rsi(df['Close'])
    df['ROC'] = ta.momentum.roc(df['Close'])

    # Trend
    df['MACD'] = ta.trend.macd_diff(df['Close'])

    # Volatility
    bollinger = ta.volatility.BollingerBands(df['Close'])
    df['BB_width'] = bollinger.bollinger_hband() - bollinger.bollinger_lband()

    # Volume
    df['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
    df['Volume_Ratio'] = df['Volume'] / df['Volume_SMA']
```

### Prediction Process
```python
def predict_future(self, data, days=30):
    # Prepare recent data
    X = self.prepare_sequence(data)
    
    # Generate predictions
    predictions = []
    current_sequence = X[-1:]
    
    for _ in range(days):
        # Predict next value
        pred = self.model.predict(current_sequence)
        predictions.append(pred[0][0])
        
        # Update sequence for next prediction
        current_sequence = self.update_sequence(current_sequence, pred)
    
    return self.inverse_transform(predictions)
```

## 📊 Supported Stocks

Major Indonesian stocks including:
- BBCA (Bank Central Asia)
- BBRI (Bank Rakyat Indonesia)
- BMRI (Bank Mandiri)
- TLKM (Telkom Indonesia)
- ASII (Astra International)
- UNVR (Unilever Indonesia)
- And many more...

## 🌐 API Endpoints

### Stock Prediction
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/stock/<symbol>` | GET | Get predictions and analysis |

### News API
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/news` | GET | Latest market news |
| `/details` | GET | Detailed article content |

## 💻 Frontend Integration

### Stock Prediction Component
```typescript
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const StockChart = ({ historicalData, predictions }) => {
  return (
    <div className="w-full h-96">
      <LineChart data={[...historicalData, ...predictions]}>
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
        <Line type="monotone" dataKey="prediction" stroke="#82ca9d" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};
```

## 🚀 Docker Deployment

### docker-compose.yml
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
    environment:
      - FLASK_ENV=production
```

## 📊 Model Performance

The LSTM model is evaluated using multiple metrics:
- MAPE: Typically 2-5% for short-term predictions
- Directional Accuracy: 40-50%
- R-squared Score: 77-84%

## 🛠️ Technical Requirements

### Backend
- Python 3.8+
- TensorFlow 2.x
- Flask
- pandas
- numpy
- scikit-learn
- BeautifulSoup4
- yfinance

### Frontend
- Node.js 16+
- Next.js 13+
- TypeScript
- Tailwind CSS
- Recharts
- Font Awesome

## 🚀 Getting Started

### Local Development

1. **Clone and Setup**
```bash
git clone https://github.com/yourusername/bursalens.git
cd bursalens
```

2. **Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

3. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### AWS EC2 Deployment

1. **Instance Setup**
```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
```

2. **Application Deployment**
```bash
docker-compose up -d
```

## 🔄 Maintenance

### Model Retraining
- Automated daily data collection
- Weekly model retraining
- Performance monitoring
- Hyperparameter optimization

### News Updates
- Real-time scraping
- Hourly content refresh
- Daily archives

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 👥 Authors

- Felix Mulya
- Email: Felixmulya777@gmail.com
- GitHub: [@felixxmulya](https://github.com/felixxmulya)

## 🙏 Acknowledgments

- [TensorFlow](https://www.tensorflow.org/)
- [yfinance](https://github.com/ranaroussi/yfinance)
- [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Liputan6](https://www.liputan6.com/)

---
⭐️ Star this repo if you find it helpful!
