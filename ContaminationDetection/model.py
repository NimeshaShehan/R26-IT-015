import tensorflow as tf
import numpy as np
from PIL import Image
import io

model = None

def build_model():
    from tensorflow.keras.applications import ResNet50
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
    from tensorflow.keras.models import Model

    base = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))
    x = base.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.4)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    output = Dense(3, activation='softmax')(x)
    return Model(inputs=base.input, outputs=output)

def load_model():
    global model
    model = build_model()
    model.load_weights('contamination_weights.weights.h5')
    print("Model loaded!")

def predict_grade(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    predictions = model.predict(arr, verbose=0)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx]) * 100

    grades = {
        0: {"grade": "A", "label": "Clean - Ready to Recycle",
            "action": "This item is clean and can be directly recycled.", "color": "green"},
        1: {"grade": "B", "label": "Dirty - Needs Cleaning",
            "action": "Wash or clean this item before recycling.", "color": "orange"},
        2: {"grade": "C", "label": "Damaged - Cannot Recycle",
            "action": "This item is too damaged. Send to landfill.", "color": "red"}
    }

    result = grades[class_idx].copy()
    result["confidence"] = round(confidence, 2)
    return result