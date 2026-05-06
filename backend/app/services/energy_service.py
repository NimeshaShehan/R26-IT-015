"""
Component 3 - Energy Service
MCDM Optimizer
"""

import pandas as pd
import os

_benchmark_cache = {}


def _load_benchmark():
    global _benchmark_cache
    if _benchmark_cache:
        return _benchmark_cache

    path = os.path.join(
        os.path.dirname(__file__), "..", "data", "recycling_benchmark.csv")

    df = pd.read_csv(path)

    # Print columns for debug
    print("CSV Columns:", list(df.columns))

    for mat in df["Material Name"].unique():
        rows = df[df["Material Name"] == mat]
        _benchmark_cache[mat] = {
            "avg_temp"  : 180.0,  # Default processing temp
            "avg_time"  : 30.0,   # Default processing time
            "avg_energy": round(rows["Energy Consumption (kWh)"].mean(), 1),
            "avg_eff"   : round(rows["Recycled Material (%)"].mean(), 1),
        }
    return _benchmark_cache


def calculate_optimal_parameters(material_name, weight_kg,
                                  moisture_condition,
                                  processing_priority="balanced"):
    benchmark = _load_benchmark()

    base = benchmark.get(material_name, {
        "avg_temp"  : 200.0,
        "avg_time"  : 35.0,
        "avg_energy": 9.0,
        "avg_eff"   : 82.0,
    })

    weight_factor = weight_kg / 5.0
    drying_adj    = 10.0 if moisture_condition == "Wet" else 0.0

    if processing_priority == "energy":
        time_mult, energy_mult = 1.15, 0.90
    elif processing_priority == "speed":
        time_mult, energy_mult = 0.90, 1.10
    else:
        time_mult, energy_mult = 1.0, 1.0

    return {
        "optimal_temp_c"           : round(base["avg_temp"], 1),
        "processing_time_min"      : round((base["avg_time"] + drying_adj) * time_mult, 1),
        "energy_kwh"               : round(base["avg_energy"] * weight_factor * energy_mult, 2),
        "recycling_efficiency_pct" : round(base["avg_eff"], 1),
    }