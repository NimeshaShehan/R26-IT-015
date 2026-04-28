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

Component 3 is the **Smart Process Optimization Engine** of the AI-Powered Automated Waste Segregation and E-waste Recycling System. It receives waste material data from Component 1 (Contamination Detection) and generates a complete **process recipe** — including the recommended recycling method, optimal temperature, processing time, energy consumption, chemical agents, and safety status.

The engine uses **3 models** working together:
- A **Decision Tree** classifier to predict the best recycling method
- A **MCDM Optimizer** to calculate optimal processing parameters
- A **Rule-Based Expert System** to determine safety status

---

## 🏗️ System Architecture

```
Component 1 Output
(waste_type + weight + moisture)
          │
          ▼
    ┌─────────────────────────────┐
    │   FastAPI Backend           │
    │   POST /optimize            │
    │                             │
    │  ┌─────────────────────┐    │
    │  │  Decision Tree      │    │
    │  │  model.pkl          │───►│ recommended_method
    │  └─────────────────────┘    │
    │                             │
    │  ┌─────────────────────┐    │
    │  │  MCDM Optimizer     │───►│ temp · time · energy
    │  │  energy_service.py  │    │
    │  └─────────────────────┘    │
    │                             │
    │  ┌─────────────────────┐    │
    │  │  Rule-Based System  │───►│ safety_status
    │  │  safety_service.py  │    │
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
| **MCDM Optimizer** | Math Optimization | Scipy | Calculate temp/time/energy | ❌ No |
| **Rule-Based** | Expert System | Pure Python | Safety status check | ❌ No |
| **Property DB** | Cloud Database | Firestore | Material lookup + history | ❌ No |

---

## 📊 Output — Process Recipe

```json
{
  "recommended_method": "Chemical",
  "optimal_temp_c": 300,
  "processing_time_min": 45,
  "energy_kwh": 8.5,
  "pre_drying_required": true,
  "safety_status": "CRITICAL",
  "chemical_agent": "Nitric Acid (HNO3)",
  "chemical_concentration": "30%",
  "chemical_purpose": "Dissolve and extract precious metals"
}
```

### Safety Status

| Status | Condition | Action |
|---|---|---|
| 🔴 **CRITICAL** | Wet + High toxicity | Stop — PPE required — Supervisor needed |
| 🟡 **WARNING** | Wet + Medium/Low toxicity | Pre-drying recommended |
| 🟢 **SECURE** | Dry material | Normal processing |

---

## 🗂️ Datasets

| Dataset | Rows | Purpose | Status |
|---|---|---|---|
| `component3_training.csv` | 6,800 | Decision Tree training | ✅ Generated |
| `recycling_benchmark.csv` | 7,000 | MCDM baseline values | ✅ Uploaded |
| `environmental_data.csv` | 7,000 | Ambient temp/humidity | ✅ Uploaded |
| `manufacturing_data.csv` | 7,000 | Energy baseline | ✅ Uploaded |
| `safety_rules.json` | — | Rule-based safety rules | ✅ Generated |
| `chemical_agent_map.json` | — | Chemical agent mapping | ✅ Generated |

### Materials Covered — 17

| Category | Materials |
|---|---|
| 🔵 **Metal** | Aluminum, Steel, Scrap Steel, Sheet Metal, Lead-Based Alloy |
| 🟠 **Plastic** | Polypropylene, Plastic Resin, Reprocessed Plastics, Packaging |
| 🔴 **E-waste** | Circuit Board, Machine Component |
| 🟢 **Organic** | Cotton, Textiles |
| 🟣 **Chemical** | Solvent, Industrial Oil, Coolant, Catalyst |

---

## 📁 Folder Structure

```
smart-process-optimization-engine/
│
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── main.py                    # FastAPI app + startup
│       ├── config.py                  # Firebase + env settings
│       │
│       ├── api/routes/
│       │   ├── optimize.py            # POST /optimize
│       │   ├── history.py             # GET /history
│       │   └── health.py              # GET /health
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
│       │   ├── environmental_data.csv
│       │   ├── manufacturing_data.csv
│       │   ├── safety_rules.json
│       │   └── chemical_agent_map.json
│       │
│       ├── utils/
│       │   ├── feature_engineering.py
│       │   ├── data_loader.py
│       │   └── validators.py
│       │
│       └── schemas/
│           ├── input_schema.py
│           └── output_schema.py
│
├── ml_training/
│   └── material_model/
│       ├── train.py                   # run → generates pkl files
│       ├── dataset/
│       │   └── component3_training.csv
│       └── notebook/
│           └── component3_validation.ipynb
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── Simulation.jsx
│       ├── components/
│       │   ├── InputForm.jsx
│       │   ├── ResultCard.jsx
│       │   ├── ProcessSteps.jsx
│       │   ├── HistoryPanel.jsx
│       │   └── SafetyBadge.jsx
│       └── services/
│           └── api.js
│
└── docs/
    ├── architecture.png
    ├── api_docs.md
    └── system_design.md
```

---

## 🚀 How to Run

### 1. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the model
```bash
cd ml_training/material_model
python train.py
```

### 3. Start backend
```bash
cd backend
uvicorn app.main:app --reload
```

### 4. API endpoints
```
POST /optimize   → Generate process recipe
GET  /history    → Get past optimizations
GET  /health     → API health check
```

---

## 🔗 Integration

This component integrates with:
- **Component 1** — Receives `waste_type + weight_kg + moisture_condition`
- **Component 2** — Cross-references hazard identification data
- **Component 4** — Provides processing data for economic valuation
- **Firestore** — Stores all optimization requests and results

---

📈 Model Accuracy

MetricValueTrain/Test Accuracy96.32%Cross Validation (5-fold)94.85% ± 1.23%Training rows5,440Test rows1,360ClassesChemical · Mechanical · Thermal
ClassPrecisionRecallF1-ScoreChemical0.970.960.96Mechanical0.950.970.96Thermal0.960.940.95

<div align="center">

**R26-IT-015 | SLIIT | 2025**

</div>
