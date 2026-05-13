import uuid, json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, JSONResponse
from schemas.disposition_schema import DispositionRequest, DispositionResponse, EnergyBreakdown
from services.thermodynamic_service import calculate_erec, get_waste_properties, WASTE_PROPERTIES
from services.pdf_service import generate_manifest_pdf

router = APIRouter()

@router.get("/waste-types")
def get_waste_types():
    """Return list of supported residual waste types."""
    return {
        "waste_types": [
            {"value": wt, "label": wt, "route": WASTE_PROPERTIES[wt]["disposition_route"]}
            for wt in WASTE_PROPERTIES.keys()
        ]
    }

@router.post("/calculate", response_model=DispositionResponse)
def calculate_disposition(request: DispositionRequest):
    """
    Strategic disposition endpoint.
    Input: waste_type + weight_kg
    Output: Erec in kWh, energy breakdown, disposition route, manifest data
    """
    try:
        props = get_waste_properties(request.waste_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    energy = calculate_erec(request.weight_kg, request.waste_type)
    
    manifest_id = f"TM-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    batch_id = request.batch_id or f"BATCH-{str(uuid.uuid4())[:6].upper()}"
    
    energy_breakdown = EnergyBreakdown(
        bio_oil_liters=energy["bio_oil_liters"],
        syngas_kwh=energy["syngas_kwh"],
        char_kg=energy["char_kg"],
        total_kwh=energy["total_kwh"],
        yield_efficiency_pct=energy["yield_efficiency_pct"],
    )
    
    return DispositionResponse(
        waste_type=request.waste_type,
        weight_kg=request.weight_kg,
        is_recyclable=False,
        disposition_route=energy["disposition_route"],
        energy_recovery_kwh=energy["erec_kwh"],
        energy_breakdown=energy_breakdown,
        lhv_mj_kg=energy["lhv_mj_kg"],
        process_efficiency=props["process_efficiency"],
        landfill_diverted=True,
        co2_avoided_kg=energy["co2_avoided_kg"],
        manifest_id=manifest_id,
        timestamp=datetime.now(timezone.utc).isoformat(),
        facility_name=request.facility_name or "Urban Recycling Facility",
    )

@router.post("/manifest/pdf")
def download_manifest_pdf(request: DispositionRequest):
    """Generate and download the Tonnage Manifest as a colourful PDF."""
    # First calculate the disposition
    try:
        props = get_waste_properties(request.waste_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    energy = calculate_erec(request.weight_kg, request.waste_type)
    manifest_id = f"TM-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    disposition_data = {
        "manifest_id": manifest_id,
        "waste_type": request.waste_type,
        "weight_kg": request.weight_kg,
        "disposition_route": energy["disposition_route"],
        "energy_breakdown": {
            "bio_oil_liters": energy["bio_oil_liters"],
            "bio_oil_kwh": energy["bio_oil_kwh"],
            "syngas_kwh": energy["syngas_kwh"],
            "char_kg": energy["char_kg"],
            "total_kwh": energy["total_kwh"],
            "yield_efficiency_pct": energy["yield_efficiency_pct"],
        },
        "lhv_mj_kg": energy["lhv_mj_kg"],
        "process_efficiency": props["process_efficiency"],
        "co2_avoided_kg": energy["co2_avoided_kg"],
        "facility_name": request.facility_name or "Urban Recycling Facility",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    
    pdf_bytes = generate_manifest_pdf(disposition_data)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=TonnageManifest_{manifest_id}.pdf"}
    )

@router.post("/manifest/json")
def export_manifest_json(request: DispositionRequest):
    """Export the Tonnage Manifest as a downloadable JSON file."""
    try:
        props = get_waste_properties(request.waste_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    energy = calculate_erec(request.weight_kg, request.waste_type)
    manifest_id = f"TM-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    manifest = {
        "manifest_id": manifest_id,
        "component": "Component 4 - Predictive Economic Valuation & Strategic Disposition Dashboard",
        "facility_name": request.facility_name or "Urban Recycling Facility",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "waste_input": {
            "waste_type": request.waste_type,
            "weight_kg": request.weight_kg,
            "is_recyclable": False,
            "classification": "Non-Recyclable Residual Waste",
        },
        "disposition": {
            "route": energy["disposition_route"],
            "landfill_diverted": True,
            "diversion_rate_pct": 100,
        },
        "energy_recovery": {
            "formula": "Erec = SUM(Mi × LHVi × η)",
            "lhv_mj_kg": energy["lhv_mj_kg"],
            "process_efficiency_eta": props["process_efficiency"],
            "erec_kwh": energy["erec_kwh"],
            "erec_mj": energy["erec_mj"],
            "bio_oil_output_liters": energy["bio_oil_liters"],
            "syngas_output_kwh": energy["syngas_kwh"],
            "char_residue_kg": energy["char_kg"],
        },
        "environmental_impact": {
            "co2_avoided_kg": energy["co2_avoided_kg"],
            "methane_prevented_co2eq_kg": round(energy["co2_avoided_kg"] * 0.21, 2),
            "sdg_alignment": ["SDG 11", "SDG 12", "SDG 13"],
        },
        "data_sources": ["EPA WARM Model", "MatWeb Material Properties Database"],
    }
    
    json_content = json.dumps(manifest, indent=2)
    return Response(
        content=json_content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=TonnageManifest_{manifest_id}.json"}
    )
