import pickle
import os
import numpy as np
import pandas as pd

#  correct paths
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH   = os.path.join(BASE_DIR, "model.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "encoders.pkl")
SCALER_PATH  = os.path.join(BASE_DIR, "scaler.pkl")
decision_tree_model = None
label_encoders      = None
feature_scaler      = None


def load_all_models():
    global decision_tree_model, label_encoders, feature_scaler

    with open(MODEL_PATH, "rb") as f:
        decision_tree_model = pickle.load(f)

    with open(ENCODER_PATH, "rb") as f:
        label_encoders = pickle.load(f)

    with open(SCALER_PATH, "rb") as f:
        feature_scaler = pickle.load(f)

    print(f"  model.pkl loaded - Classes: {list(decision_tree_model.classes_)}")
    print(f"  encoders.pkl loaded")
    print(f"  scaler.pkl loaded")


def get_model():
    return decision_tree_model

def get_encoders():
    return label_encoders

def get_scaler():
    return feature_scaler


def predict_method(material_name, waste_type, weight_kg,
                   moisture_condition, moisture_pct, toxicity_level):

    model    = get_model()
    encoders = get_encoders()
    scaler   = get_scaler()

    # Encode
    mat_enc  = encoders["material"].transform([material_name])[0]
    mois_enc = encoders["moisture"].transform([moisture_condition])[0]
    cat_enc  = encoders["category"].transform([waste_type])[0]
    tox_enc  = encoders["toxicity"].transform([toxicity_level])[0]

    # Build DataFrame with feature names — fixes StandardScaler warning
    FEATURES = ["mat_enc", "cat_enc", "weight_kg",
                "mois_enc", "moisture_pct", "tox_enc"]

    features_df = pd.DataFrame(
        [[mat_enc, cat_enc, weight_kg, mois_enc, moisture_pct, tox_enc]],
        columns=FEATURES
    )

    # Scale
    features_scaled = scaler.transform(features_df)

    # Predict
    method = model.predict(features_scaled)[0]
    return method