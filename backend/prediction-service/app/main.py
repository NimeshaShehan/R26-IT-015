from fastapi import FastAPI
from pydantic import BaseModel
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


# 🔷 Request format
class PredictRequest(BaseModel):
    gdp: list   # [4000, 4200, 4100]
    imports: list  # [4.5, 4.8, 4.6]


@app.post("/predict")
def predict(data: PredictRequest):

    # Validate length
    if len(data.gdp) != len(data.imports):
        return {"error": "GDP and Imports must have same length"}

    if len(data.gdp) != 3:
        return {"error": "Exactly 3 time steps required"}

    # Combine features
    X = np.array(list(zip(data.gdp, data.imports)))

    # Scale
    X_scaled = scaler_X.transform(X)

    # Reshape
    X_scaled = X_scaled.reshape(1, 3, 2)

    # Predict
    y_pred = model.predict(X_scaled)

    # Inverse scale
    y_pred_actual = scaler_y.inverse_transform(y_pred)

    result = float(y_pred_actual[0][0])

    return {
        "prediction": round(result, 2),
        "unit": "Metric Tons"
    }

# Root test
@app.get("/")
def root():
    return {"message": "E-Waste Prediction API Running"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)