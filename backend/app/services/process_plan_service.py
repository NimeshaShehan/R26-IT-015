"""
Component 3 - Process Plan Service
Combine 3 models results - final process recipe JSON
"""

import json
import os

_chemical_cache = None


def _load_chemical_map():
    global _chemical_cache
    if _chemical_cache:
        return _chemical_cache
    path = os.path.join(os.path.dirname(__file__), "..", "data", "chemical_agent_map.json")
    with open(path) as f:
        data = json.load(f)
    _chemical_cache = data["chemical_agents"]
    return _chemical_cache


def build_process_recipe(
    material_name, waste_type, weight_kg, moisture_condition,
    recommended_method,
    optimal_temp_c, processing_time_min, energy_kwh, recycling_efficiency_pct,
    safety_status, pre_drying_required, toxicity_level
):
    """
    Combine all 3 model outputs into final process recipe.
    """
    chemical_map  = _load_chemical_map()
    chemical_info = chemical_map.get(material_name, {
        "chemical_agent"        : "None",
        "chemical_concentration": "None",
        "chemical_purpose"      : "No chemical required",
        "handling_note"         : "Standard safety",
    })

    return {
        "material_name"           : material_name,
        "waste_type"              : waste_type,
        "weight_kg"               : weight_kg,
        "moisture_condition"      : moisture_condition,
        "recommended_method"      : recommended_method,
        "optimal_temp_c"          : optimal_temp_c,
        "processing_time_min"     : processing_time_min,
        "energy_kwh"              : energy_kwh,
        "recycling_efficiency_pct": recycling_efficiency_pct,
        "safety_status"           : safety_status,
        "pre_drying_required"     : pre_drying_required,
        "toxicity_level"          : toxicity_level,
        "chemical_agent"          : chemical_info.get("chemical_agent"),
        "chemical_concentration"  : chemical_info.get("chemical_concentration"),
        "chemical_purpose"        : chemical_info.get("chemical_purpose"),
        "handling_note"           : chemical_info.get("handling_note"),
    }
