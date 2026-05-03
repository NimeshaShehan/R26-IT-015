from fastapi import FastAPI
import numpy as np
import joblib
import tensorflow as tf
from pathlib import Path

app = FastAPI()

# Load model and scalers
BASE_DIR = Path(__file__).resolve().parent.parent

model = tf.keras.models.load_model(
    BASE_DIR / "models" / "lstm_model.h5",
    compile=False
)
scaler_X = joblib.load(BASE_DIR / "models" / "scaler_X.pkl")
scaler_y = joblib.load(BASE_DIR / "models" / "scaler_y.pkl")

print("✅ Model and scalers loaded successfully")

# Dummy test prediction
def test_prediction():
    # Dummy data (GDP, Imports for 3 time steps)
    X = np.array([
        [4000, 4.5],
        [4200, 4.8],
        [4100, 4.6]
    ])

    # Scale
    X_scaled = scaler_X.transform(X)

    # Reshape for LSTM (1, 3, 2)
    X_scaled = X_scaled.reshape(1, 3, 2)

    # Predict
    y_pred = model.predict(X_scaled)

    # Inverse scale
    y_pred_actual = scaler_y.inverse_transform(y_pred)

    print("🔮 Prediction:", y_pred_actual[0][0])

# Run test on startup


@app.get("/")
def root():
    return {"message": "E-Waste Prediction API Running"}