from pathlib import Path

import joblib
import numpy as np
import tensorflow as tf
from fastapi import FastAPI

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
SERVICE_MODELS_DIR = BASE_DIR.parent / "models"
BACKEND_MODELS_DIR = BASE_DIR.parent.parent / "models"

MODEL_CANDIDATES = [
    SERVICE_MODELS_DIR / "lstm_model.keras",
    SERVICE_MODELS_DIR / "lstm_model.h5",
    BACKEND_MODELS_DIR / "lstm_model.keras",
    BACKEND_MODELS_DIR / "lstm_model.h5",
]
SCALER_X_CANDIDATES = [
    SERVICE_MODELS_DIR / "scaler_X.pkl",
    BACKEND_MODELS_DIR / "scaler_X.pkl",
]
SCALER_Y_CANDIDATES = [
    SERVICE_MODELS_DIR / "scaler_y.pkl",
    BACKEND_MODELS_DIR / "scaler_y.pkl",
]

model = None
scaler_X = None
scaler_y = None


def first_existing_path(candidates: list[Path]) -> Path:
    for candidate in candidates:
        if candidate.exists():
            return candidate
    raise FileNotFoundError(
        "Could not find any of these files: "
        + ", ".join(str(candidate) for candidate in candidates)
    )


def load_artifacts() -> None:
    global model, scaler_X, scaler_y

    model_path = first_existing_path(MODEL_CANDIDATES)
    scaler_X_path = first_existing_path(SCALER_X_CANDIDATES)
    scaler_y_path = first_existing_path(SCALER_Y_CANDIDATES)

    print(f"Loading model from: {model_path}")
    print(f"Loading scaler_X from: {scaler_X_path}")
    print(f"Loading scaler_y from: {scaler_y_path}")

    model = tf.keras.models.load_model(str(model_path), compile=False)
    scaler_X = joblib.load(scaler_X_path)
    scaler_y = joblib.load(scaler_y_path)


def run_test_prediction() -> float:
    if model is None or scaler_X is None or scaler_y is None:
        raise RuntimeError("Model and scalers must be loaded before prediction.")

    dummy_input = np.array(
        [
            [4000, 4.5],
            [4200, 4.8],
            [4100, 4.6],
        ],
        dtype=np.float32,
    )

    scaled_input = scaler_X.transform(dummy_input)
    model_input = scaled_input.reshape(1, 3, 2)
    predicted_scaled = model.predict(model_input, verbose=0)
    predicted_value = scaler_y.inverse_transform(predicted_scaled)

    final_prediction = float(predicted_value[0][0])
    print(f"Dummy input:\n{dummy_input}")
    print(f"Scaled input:\n{scaled_input}")
    print(f"Final predicted value: {final_prediction}")

    return final_prediction


@app.on_event("startup")
def startup_event() -> None:
    load_artifacts()
    run_test_prediction()
