from pydantic import BaseModel, Field
from typing import List, Optional

class DispositionRequest(BaseModel):
    waste_type: str = Field(..., description="Type of residual waste")
    weight_kg: float = Field(..., gt=0, description="Weight of waste in kg")
    facility_name: Optional[str] = "Urban Recycling Facility"
    batch_id: Optional[str] = None

class EnergyBreakdown(BaseModel):
    bio_oil_liters: float
    syngas_kwh: float
    char_kg: float
    total_kwh: float
    yield_efficiency_pct: float

class DispositionResponse(BaseModel):
    waste_type: str
    weight_kg: float
    is_recyclable: bool
    disposition_route: str        # e.g., "Pyrolysis Processing"
    energy_recovery_kwh: float
    energy_breakdown: EnergyBreakdown
    lhv_mj_kg: float
    process_efficiency: float
    landfill_diverted: bool       # Always True for our system
    co2_avoided_kg: float
    manifest_id: str
    timestamp: str
    facility_name: str
