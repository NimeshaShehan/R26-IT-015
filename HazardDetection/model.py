from ultralytics import YOLO
from PIL import Image
import io, json

model = None
knowledge_base = None

def load_model():
    global model, knowledge_base
    model = YOLO('yolov8_ewaste_best.pt')
    with open('knowledge_base.json', 'r') as f:
        knowledge_base = json.load(f)
    print("Hazard Detection Model loaded!")

def analyze_hazard(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    results = model(img, verbose=False)
    probs = results[0].probs
    device_type = results[0].names[probs.top1]
    confidence = float(probs.top1conf) * 100

    hazard_icons = {"LOW": "🟡", "MEDIUM": "🟠", "HIGH": "🔴", "CRITICAL": "🚨"}

    if device_type not in knowledge_base:
        return {"device": device_type, "confidence": round(confidence, 2),
                "error": "Device not in knowledge base"}

    info = knowledge_base[device_type]
    hazard_levels = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 4}
    max_level = "LOW"
    for mat, hazard in info["hazards"].items():
        if hazard_levels.get(hazard["level"], 0) > hazard_levels.get(max_level, 0):
            max_level = hazard["level"]

    return {
        "device": device_type,
        "confidence": round(confidence, 2),
        "overall_hazard_level": max_level,
        "hazard_icon": hazard_icons.get(max_level, "⚠️"),
        "materials": info["materials"],
        "hazard_explanations": info["hazards"],
        "ppe_required": info["ppe"],
        "handling_instructions": info["handling"],
        "recovery_value": info["recovery_value"]
    }