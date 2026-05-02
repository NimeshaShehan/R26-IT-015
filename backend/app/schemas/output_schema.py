"""
Component 3 - Output Schema (Pydantic)
"""

from pydantic import BaseModel
from typing import Optional


class OptimizeResponse(BaseModel):
    # Input echo
    material_name      : str
    waste_type         : str
    weight_kg          : float
    moisture_condition : str

    # Model 1 - Decision Tree output
    recommended_method : str

    # Model 2 - MCDM output
    optimal_temp_c            : float
    processing_time_min       : float
    energy_kwh                : float
    recycling_efficiency_pct  : float

    # Model 3 - Rule-Based output
    safety_status        : str
    pre_drying_required  : bool
    toxicity_level       : str

    # Chemical agent info
    chemical_agent        : Optional[str] = None
    chemical_concentration: Optional[str] = None
    chemical_purpose      : Optional[str] = None
    handling_note         : Optional[str] = None

    # Metadata
    timestamp : Optional[str] = None
    doc_id    : Optional[str] = None
