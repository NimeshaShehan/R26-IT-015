"""
Component 3 - POST /optimize route
Main endpoint - receives input and returns process recipe
"""

from fastapi import APIRouter, HTTPException
from app.schemas.input_schema import OptimizeRequest
from app.schemas.output_schema import OptimizeResponse
from app.services.optimization_service import get_recommended_method
from app.services.energy_service import calculate_optimal_parameters
from app.services.safety_service import check_safety, get_toxicity_level
from app.services.process_plan_service import build_process_recipe
from app.services.firestore_service import save_optimization_request, save_optimization_result

router = APIRouter()


@router.post("/optimize", response_model=OptimizeResponse)
def optimize(request: OptimizeRequest):
    """
    Receive waste material data and generate process recipe.

    Input : material_name + waste_type + weight_kg + moisture_condition
    Output: recommended_method + temp + time + energy + safety_status
    """
    try:
        # Get toxicity level
        toxicity_level = get_toxicity_level(request.material_name)

        # Model 1 - Decision Tree predict
        recommended_method = get_recommended_method(
            material_name      = request.material_name,
            waste_type         = request.waste_type,
            weight_kg          = request.weight_kg,
            moisture_condition = request.moisture_condition,
            moisture_pct       = request.moisture_pct or 50.0,
            toxicity_level     = toxicity_level
        )

        # Model 2 - MCDM calculate
        energy_params = calculate_optimal_parameters(
            material_name       = request.material_name,
            weight_kg           = request.weight_kg,
            moisture_condition  = request.moisture_condition,
            processing_priority = request.processing_priority or "balanced"
        )

        # Model 3 - Rule-Based safety check
        safety_result = check_safety(
            material_name      = request.material_name,
            moisture_condition = request.moisture_condition,
            toxicity_level     = toxicity_level
        )

        # Combine all results
        recipe = build_process_recipe(
            material_name            = request.material_name,
            waste_type               = request.waste_type,
            weight_kg                = request.weight_kg,
            moisture_condition       = request.moisture_condition,
            recommended_method       = recommended_method,
            optimal_temp_c           = energy_params["optimal_temp_c"],
            processing_time_min      = energy_params["processing_time_min"],
            energy_kwh               = energy_params["energy_kwh"],
            recycling_efficiency_pct = energy_params["recycling_efficiency_pct"],
            safety_status            = safety_result["safety_status"],
            pre_drying_required      = safety_result["pre_drying_required"],
            toxicity_level           = toxicity_level,
        )

        # Save to Firestore
        save_optimization_request(request.dict())
        doc_id = save_optimization_result(recipe)
        recipe["doc_id"] = doc_id

        return OptimizeResponse(**recipe)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
