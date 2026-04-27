# R26-IT-015

# ♻️ E-Waste Forecasting System — Data Pipeline & Preprocessing

## 📌 Overview
This component focuses on building a **clean, structured, and ML-ready dataset** for forecasting e-waste generation using time-series modeling.

The goal is to transform raw, heterogeneous datasets into a **single unified dataset** suitable for machine learning models such as LSTM.

---

## 🎯 Objective
- Collect real-world datasets (GDP, Imports, E-waste)
- Clean and transform raw data
- Align datasets into a unified structure
- Handle missing values and inconsistencies
- Prepare data for machine learning models

---

## 🧠 Key Concepts Used
- Data Cleaning
- Data Transformation (Wide → Long)
- Time-Series Data Handling
- Feature Selection
- Data Scaling (MinMaxScaler)

---

## 📂 Project Structure
ml/
├── data/
│ ├── raw/ # Original datasets
│ ├── processed/ # Cleaned datasets
│
├── notebooks/
│ └── 01_data_check.ipynb # Data processing workflow
│
├── venv/ # Virtual environment


---

## 📊 Datasets Used

| Dataset | Source | Description |
|--------|-------|------------|
| GDP per capita | World Bank | Economic indicator |
| Imports (ICT goods %) | World Bank | Proxy for electronic consumption |
| E-waste generation | Kaggle | Target variable |

---

## ⚙️ Data Processing Pipeline

### 1. Data Loading
- Imported CSV datasets
- Skipped metadata rows in World Bank data

---

### 2. Data Cleaning
- Filtered only relevant country (Sri Lanka - simulated)
- Removed unnecessary columns
- Handled missing values

---

### 3. Data Transformation
- Converted **wide format → long format**
- Standardized column names:
      Country | Year | Value


---

### 4. Data Alignment
- Ensured all datasets share:
- Same country
- Same time range

---

### 5. Data Merging
Combined datasets into a single dataframe:

Country | Year | GDP | Imports | E_waste_MT

---

### 6. Handling Missing Time Steps
- Identified gaps in time series
- Applied **forward fill (ffill)** to maintain continuity

---

### 7. Feature Selection

**Input (X):**
- GDP
- Imports

**Target (y):**
- E_waste_MT

---

### 8. Data Scaling

Used **MinMaxScaler** to normalize values:
0 → 1 range


✔ Prevents dominance of large values  
✔ Improves model performance  

---

## 📈 Final Dataset Sample

| Year | GDP | Imports | E_waste_MT |
|-----|-----|--------|------------|
| 2015 | 4057 | 4.22 | 4100000 |
| 2016 | 4149 | 4.95 | 4370000 |
| ... | ... | ... | ... |

---

## 🚨 Challenges Faced

- World Bank data in **wide format**
- Missing time-series values
- Dataset inconsistency across sources
- No Sri Lanka e-waste data (handled via simulation)

---

## 💡 Solutions Implemented

- Used `skiprows=4` to fix metadata issue
- Converted wide → long using `melt()`
- Applied forward fill for missing years
- Simulated consistent country data for alignment

---

## 🧪 Tools & Technologies

- Python 🐍
- Pandas
- NumPy
- Scikit-learn
- Jupyter Notebook

---

## ✅ Current Status

✔ Data pipeline completed  
✔ Dataset cleaned and structured  
✔ Ready for model training  

---

## 🔜 Next Steps

- Train baseline model
- Implement LSTM model
- Add feature engineering (lag features)
- Evaluate model performance

---

## 👨‍💻 Author

**Sanjula Madushanka**

---

## 📌 Notes

This module focuses on **data engineering and preprocessing**, which forms the foundation for the entire forecasting system.

---