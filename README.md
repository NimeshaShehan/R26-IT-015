# 🔄 Component 3 — Smart Process Optimization Engine

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**AI-Powered Automated Waste Segregation and E-waste Recycling System**

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

Component 3 is the **Smart Process Optimization Engine** of the AI-Powered Automated Waste Segregation and E-waste Recycling System. It receives waste material data and generates a complete **process recipe** — including the recommended recycling method, optimal temperature, processing time, energy consumption, and safety status.

The engine uses a **Hybrid Architecture** with 3 models working together:
- A **Decision Tree Classifier** to predict the best recycling method (Mechanical or Thermal)
- A **MCDM Optimizer** to calculate optimal processing parameters
- A **Rule-Based Expert System** to determine safety status and pre-drying requirements

---

## 🏗️ System Architecture

```
Input
(material_name + weight_kg + moisture_condition + waste_type)
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
    → React Dashboard Display
    → Firestore Save
```

---

## 🤖 Models

| Model | Type | Library | Purpose | Train? |
|---|---|---|---|---|
| **Decision Tree** | ML Classifier | Scikit-learn | Predict recommended_method | ✅ Yes |
| **MCDM Optimizer** | Math Optimization | Pure Python | Calculate temp/time/energy | ❌ No |
| **Rule-Based** | Expert System | Pure Python | Safety status check | ❌ No |

---

## 📊 Output — Process Recipe

```json
{
  "material_name": "PET Water Bottles",
  "recommended_method": "Thermal",
  "optimal_temp_c": 265,
  "processing_time_min": 39,
  "energy_kwh": 5.5,
  "recycling_efficiency_pct": 87.3,
  "pre_drying_required": true,
  "pre_drying_temp_c": 106,
  "pre_drying_time_min": 11.7,
  "safety_status": "WARNING",
  "chemical_agent": "None",
  "toxicity_level": "Low"
}
```

### Safety Status

| Status | Condition | Action |
|---|---|---|
| 🔴 **CRITICAL** | Wet + High toxicity | Stop — Full PPE required — Supervisor needed |
| 🟡 **WARNING** | Wet + Any toxicity | Pre-drying required before processing |
| 🟢 **SECURE** | Dry material | Normal processing — standard safety |

---

## 🗂️ Datasets

| Dataset | Rows | Purpose | Status |
|---|---|---|---|
| `component3_training_v2.csv` | 7,000 | Decision Tree training | ✅ Generated |
| `recycling_benchmark.csv` | 7,000 | MCDM baseline values | ✅ Uploaded |
| `safety_rules.json` | — | Rule-based safety rules | ✅ Generated |
| `chemical_agent_map.json` | — | Chemical agent mapping | ✅ Generated |

### Materials Covered — 14 MSW Materials

| Category | Method | Materials |
|---|---|---|
| 📄 **Paper** | Mechanical | Newspapers, Cardboard Boxes, Office Paper |
| 🧴 **Plastic** | Thermal | PET Water Bottles, Food Containers, Plastic Bags |
| 🫙 **Glass** | Mechanical | Glass Bottles, Glass Jars |
| 👕 **Textile** | Mechanical | Old Clothes, Fabric Scraps |
| 🛞 **Rubber** | Thermal | Old Tires, Rubber Footwear |
| 🪵 **Wood** | Mechanical | Wooden Pallets, Furniture Scraps |

> **Note:** Plastic and Rubber use Thermal method. All others use Mechanical method. Wet materials automatically trigger pre-drying cycle.

---

## 📁 Folder Structure

```
component3-smart-optimization/
│
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── main.py                      # FastAPI app + startup
│       ├── config.py                    # Firebase + env settings
│       │
│       ├── api/routes/
│       │   ├── optimize.py              # POST /api/optimize
│       │   ├── history.py               # GET  /api/history
│       │   ├── health.py                # GET  /api/health
│       │   └── materials.py             # GET  /api/materials
│       │
│       ├── services/
│       │   ├── optimization_service.py  # Decision Tree predict
│       │   ├── energy_service.py        # MCDM calculate
│       │   ├── safety_service.py        # Rule-based check
│       │   ├── process_plan_service.py  # Results combine
│       │   └── firestore_service.py     # Firestore save/read
│       │
│       ├── models/
│       │   ├── load_models.py           # pkl load + predict
│       │   └── material_model/
│       │       ├── model.pkl            # trained Decision Tree
│       │       ├── encoders.pkl         # label encoders
│       │       └── scaler.pkl           # feature scaler
│       │
│       ├── data/
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
│       ├── train_v2.py                  # run → generates pkl files
│       └── dataset/
│           └── component3_training_v2.csv
│
├── frontend_react/
│   └── src/
│       ├── pages/
│       │   └── Dashboard.jsx
│       └── services/
│           └── api.js
│
└── docs/
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

### 2. Train the model (Google Colab recommended)
```bash
# Upload component3_training_v2.csv to Colab
# Run train_v2.py
# Download model.pkl, encoders.pkl, scaler.pkl
# Paste into backend/app/models/material_model/
```

### 3. Start backend
```bash
cd backend
uvicorn app.main:app --reload
```

### 4. Start frontend
```bash
cd frontend_react
npm start
```

### 5. API endpoints
```
POST /api/optimize    → Generate process recipe
GET  /api/history     → Get past optimizations
GET  /api/health      → API health check
GET  /api/materials   → Get all 14 supported materials
```

### 6. Verify startup
```
model.pkl loaded - Classes: ['Mechanical', 'Thermal']
encoders.pkl loaded
scaler.pkl loaded
Firebase connected!
INFO: Uvicorn running on http://127.0.0.1:8000
```

---

## 🔗 Integration

This component integrates with:
- **Component 1** — Receives `waste_type + weight_kg + moisture_condition`
- **Component 2** — Cross-references hazard identification data
- **Component 4** — Provides processing data for economic valuation
- **Firestore** — Stores all optimization requests and results

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

| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| Mechanical | 0.95 | 0.96 | 0.95 |
| Thermal | 0.94 | 0.93 | 0.93 |

---

## 🧠 Hybrid Architecture — Why 3 Models?

| Approach | Used For | Reason |
|---|---|---|
| **ML — Decision Tree** | Method prediction | Pattern recognition from 7,000 training examples |
| **Math — MCDM** | Parameter calculation | Scientific precision using real benchmark averages |
| **Rules — Expert System** | Safety classification | Fixed standards that must never be approximated |

---

<div align="center">

**R26-IT-015 | SLIIT | 2025 | IT22277640**

</div>