# 🔄 Component 3 — Smart Process Optimization Engine

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**AI-Powered Automated Waste Segregation and Recycling System**

*Research Project: R26-IT-015 | SLIIT B.Sc. IT Dissertation*

</div>

---

## 👨‍💻 Developer

| Field | Details |
|---|---|
| **Name** | W.C Udumullage |
| **Student ID** | IT22277640 |
| **Institution** | Sri Lanka Institute of Information Technology (SLIIT) |
| **Supervisor** | Samantha Rajapaksha |
| **Component** | Component 3 — Smart Process Optimization Engine |

---

## 📌 Overview

Component 3 is the **Smart Process Optimization Engine**. It receives waste material data and automatically generates a complete **process recipe** — including the recommended recycling method, optimal temperature, processing time, energy consumption, safety status, pre-drying requirements, and handling notes.

The engine uses a **Hybrid Architecture** combining three different models:
- **Decision Tree Classifier** — predicts Mechanical or Thermal recycling method
- **MCDM Optimizer** — calculates temperature, time, and energy parameters
- **Rule-Based Expert System** — determines safety status and pre-drying requirements

---

## 🏗️ System Architecture

```
Input
(material_name + weight_kg + moisture_condition)
          │
          ▼
    ┌─────────────────────────────┐
    │   FastAPI Backend           │
    │   POST /api/optimize        │
    │                             │
    │  ┌─────────────────────┐    │
    │  │  Decision Tree      │    │
    │  │  model.pkl          │───►│ recommended_method
    │  └─────────────────────┘    │ (Mechanical / Thermal)
    │                             │
    │  ┌─────────────────────┐    │
    │  │  MCDM Optimizer     │───►│ temp · time · energy
    │  │  energy_service.py  │    │
    │  └─────────────────────┘    │
    │                             │
    │  ┌─────────────────────┐    │
    │  │  Rule-Based System  │───►│ safety_status
    │  │  safety_service.py  │    │ pre_drying_required
    │  └─────────────────────┘    │
    └─────────────────────────────┘
          │
          ▼
    Process Recipe JSON
    → React Dashboard
    → Firestore Save
```

---

## 🤖 Models

| Model | Type | Purpose | Train? |
|---|---|---|---|
| **Decision Tree** | ML Classifier | Predict Mechanical or Thermal | ✅ Yes |
| **MCDM Optimizer** | Mathematical | Calculate temp / time / energy | ❌ No |
| **Rule-Based Expert** | IF/THEN Rules | Safety status + pre-drying | ❌ No |

---

## 📦 PKL Files — Retraining Guide

When retraining the model, **3 files** must be replaced:

| File | Purpose |
|---|---|
| `model.pkl` | Trained Decision Tree Classifier |
| `encoders.pkl` | Label Encoders for material, moisture, waste_type, toxicity |
| `scaler.pkl` | StandardScaler for feature normalization |

> ⚠️ All 3 files must come from the **same training run** — mixing files from different runs will cause prediction errors.

**Encoder keys inside encoders.pkl:**
```python
{
  "material"     : LabelEncoder,  # material_name
  "moisture"     : LabelEncoder,  # moisture_condition
  "category"     : LabelEncoder,  # waste_type
  "toxicity"     : LabelEncoder,  # toxicity_level
  "feature_names": list           # feature order
}
```

---

## 📊 Output — Process Recipe

```json
{
  "material_name"           : "PET Water Bottles",
  "recommended_method"      : "Thermal",
  "optimal_temp_c"          : 265.0,
  "processing_time_min"     : 45.0,
  "energy_kwh"              : 5.5,
  "recycling_efficiency_pct": 87.3,
  "pre_drying_required"     : true,
  "pre_drying_temp_c"       : 106.0,
  "pre_drying_time_min"     : 13.5,
  "pre_drying_action"       : "Apply controlled heat to remove moisture content",
  "safety_status"           : "WARNING",
  "chemical_agent"          : "None",
  "chemical_purpose"        : "No chemical required - Thermal melting",
  "handling_note"           : "Ensure proper ventilation during thermal processing",
  "cooling_time_min"        : 11.25,
  "cooling_method"          : "Controlled Cooling",
  "target_temp_c"           : 30.0,
  "batch_id"                : "BATCH-1746421929610",
  "timestamp"               : "2026-05-05T04:32:09.610629"
}
```

### Safety Status Rules

| Moisture | Toxicity | Safety Status | Pre-Drying |
|---|---|---|---|
| Wet | High | 🔴 CRITICAL | Yes |
| Wet | Medium | 🟡 WARNING | Yes |
| Wet | Low | 🟡 WARNING | Yes |
| Dry | High | 🟡 WARNING | No |
| Dry | Medium | 🟢 SECURE | No |
| Dry | Low | 🟢 SECURE | No |

---

## 🗂️ Datasets

| Dataset | Rows | Purpose |
|---|---|---|
| `component3_training_v2.csv` | 7,000 | Decision Tree training |
| `recycling_benchmark.csv` | — | MCDM energy + efficiency values |
| `safety_rules.json` | — | Rule-based safety matrix |
| `chemical_agent_map.json` | — | Chemical agent + handling notes |

### Materials Covered — 14 MSW Materials

| Category | Method | Materials |
|---|---|---|
| 📄 **Paper** | Mechanical | Newspapers, Cardboard Boxes, Office Paper |
| 🧴 **Plastic** | Thermal | PET Water Bottles, Food Containers, Plastic Bags |
| 🫙 **Glass** | Mechanical | Glass Bottles, Glass Jars |
| 👕 **Textile** | Mechanical | Old Clothes, Fabric Scraps |
| 🛞 **Rubber** | Thermal | Old Tires, Rubber Footwear |
| 🪵 **Wood** | Mechanical | Wooden Pallets, Furniture Scraps |

> **Note:** Plastic and Rubber → Thermal. All others → Mechanical. Wet materials automatically trigger pre-drying.

---

## 📁 Folder Structure

```
component3-smart-optimization/
│
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py
│       │
│       ├── api/routes/
│       │   ├── optimize.py       # POST /api/optimize
│       │   ├── history.py        # GET  /api/history
│       │   ├── health.py         # GET  /api/health
│       │   └── materials.py      # GET  /api/materials
│       │
│       ├── services/
│       │   ├── optimization_service.py
│       │   ├── energy_service.py
│       │   ├── safety_service.py
│       │   ├── process_plan_service.py
│       │   └── firestore_service.py
│       │
│       ├── models/
│       │   ├── load_models.py
│       │   └── material_model/
│       │       ├── model.pkl       ← Decision Tree
│       │       ├── encoders.pkl    ← Label Encoders (4)
│       │       └── scaler.pkl      ← StandardScaler
│       │
│       ├── data/
│       │   ├── component3_training_v2.csv
│       │   ├── recycling_benchmark.csv
│       │   ├── safety_rules.json
│       │   └── chemical_agent_map.json
│       │
│       └── schemas/
│           ├── input_schema.py
│           └── output_schema.py
│
├── ml_training/
│   └── material_model/
│       ├── train_v2.py
│       └── dataset/
│           └── component3_training_v2.csv
│
├── frontend_react/
│   └── src/
│       ├── pages/
│       │   └── Dashboard.jsx
│       ├── services/
│       │   └── api.js
│       └── translations.js
│
└── docs/
    ├── README.md
    ├── model_description_EN.docx
    └── model_description_EN_SI.md
```

---

## 🚀 How to Run

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the model (Google Colab)
```
1. Upload component3_training_v2.csv to Colab
2. Run train_v2.py
3. Download model.pkl, encoders.pkl, scaler.pkl
4. Delete old pkl files from backend/app/models/material_model/
5. Paste new pkl files into backend/app/models/material_model/
```

### 3. Start backend
```bash
cd backend
uvicorn app.main:app --reload
```

### 4. Verify startup
```
model.pkl loaded - Classes: ['Mechanical', 'Thermal'] ✅
encoders.pkl loaded ✅
scaler.pkl loaded ✅
Firebase connected! ✅
INFO: Uvicorn running on http://127.0.0.1:8000
```

### 5. Start frontend
```bash
cd frontend_react
npm start
```

### 6. API Endpoints
```
POST /api/optimize    → Generate process recipe
GET  /api/history     → Optimization history
GET  /api/health      → API health check
GET  /api/materials   → All 14 supported materials
```

### 7. API Docs
```
http://localhost:8000/docs
```

---

## 🔗 Component Integration

```python
# Component 1 → Component 3
import requests

response = requests.post(
    "http://localhost:8000/api/optimize",
    json={
        "material_name"      : "Cardboard Boxes",
        "weight_kg"          : 5.0,
        "moisture_condition" : "Wet"
    }
)
recipe = response.json()
```

---

## 📈 Model Accuracy

| Metric | Value |
|---|---|
| Train/Test Accuracy | **94.56%** |
| Cross Validation (5-fold) | **93.69% ± 0.45%** |
| Training rows | 5,600 |
| Test rows | 1,400 |
| Noise added | 5% random label flip |
| Classes | Mechanical · Thermal |

---

## 🌐 Multi-Language Support

Dashboard supports 3 languages:

| Language | Code | Flag |
|---|---|---|
| English | EN | 🇬🇧 |
| Sinhala | SI | 🇱🇰 |
| Tamil | TA | 🇱🇰 |

---

## 🔮 Future Enhancements

- **IoT Sensor Integration** — Auto-detect weight and moisture
- **Weather API Integration** — Auto moisture detection via rainfall data
- **Batch Scheduling** — Queue multiple materials
- **CO2 Emission Tracking** — Environmental impact reporting
- **Auto Retraining Pipeline** — Retrain when new data arrives
- **Mobile App** — React Native for operators

---

<div align="center">

**R26-IT-015 | SLIIT | 2026 | IT22277640**

</div>