from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from schemas.forecast_schema import ForecastRequest, ForecastResponse, ForecastDataPoint
from services import arima_service, lstm_service, market_timing
import random
import math
from datetime import datetime

router = APIRouter()

VALID_METALS = ["aluminium", "copper", "lead", "nickel", "zinc", "silver", "gold"]

@router.get("/metals")
def get_metals():
    """Return list of supported metals with display names."""
    return {
        "metals": [
            {"value": "aluminium", "label": "Aluminium", "symbol": "Al"},
            {"value": "copper",    "label": "Copper",    "symbol": "Cu"},
            {"value": "lead",      "label": "Lead",      "symbol": "Pb"},
            {"value": "nickel",    "label": "Nickel",    "symbol": "Ni"},
            {"value": "zinc",      "label": "Zinc",      "symbol": "Zn"},
            {"value": "silver",    "label": "Silver",    "symbol": "Ag"},
            {"value": "gold",      "label": "Gold (Refined)", "symbol": "Au"},
        ]
    }

@router.post("/predict", response_model=ForecastResponse)
def predict_forecast(request: ForecastRequest):
    """
    Main forecast endpoint.
    Input: metal type + weight in kg
    Output: 90-day ARIMA+LSTM ensemble forecast + Sell/Hold recommendation + profit/hold info
    """
    metal = request.metal.lower()
    if metal not in VALID_METALS:
        raise HTTPException(status_code=400, detail=f"Invalid metal. Choose from: {VALID_METALS}")
    
    # Run both models
    arima_result = arima_service.generate_forecast(metal, horizon=90)
    lstm_result  = lstm_service.generate_forecast(metal, horizon=90)
    
    # Ensemble forecast
    ensemble_prices = market_timing.ensemble_forecast(
        arima_result["forecast_prices"],
        lstm_result["forecast_prices"]
    )
    
    # Average lower/upper bounds
    n = len(ensemble_prices)
    lower = [(a + b) / 2 for a, b in zip(arima_result["lower_bound"][:n], lstm_result["lower_bound"][:n])]
    upper = [(a + b) / 2 for a, b in zip(arima_result["upper_bound"][:n], lstm_result["upper_bound"][:n])]
    
    dates = arima_result["forecast_dates"][:n]
    current_price = arima_result["current_price"]
    
    # Make market timing decision
    decision = market_timing.make_recommendation(
        current_price=current_price,
        forecast_prices=ensemble_prices,
        forecast_dates=dates,
        weight_kg=request.weight_kg,
        metal=metal
    )
    
    # Build forecast data points
    forecast_points = [
        ForecastDataPoint(
            date=dates[i],
            price=round(ensemble_prices[i], 4),
            lower_bound=round(lower[i], 4),
            upper_bound=round(upper[i], 4),
        )
        for i in range(n)
    ]
    
    # Average MAPE/RMSE
    avg_mape = round((arima_result["mape"] + lstm_result["mape"]) / 2, 2)
    avg_rmse = round((arima_result["rmse"] + lstm_result["rmse"]) / 2, 4)
    
    return ForecastResponse(
        metal=metal,
        current_price=round(current_price, 4),
        forecast_90d=forecast_points,
        recommendation=decision["recommendation"],
        recommendation_reason=decision["reason"],
        profit_if_sell=decision.get("profit_if_sell"),
        expected_peak_price=decision.get("expected_peak_price"),
        expected_peak_date=decision.get("expected_peak_date"),
        mape=avg_mape,
        rmse=avg_rmse,
        model_used="ARIMA + LSTM Ensemble",
        weight_kg=request.weight_kg,
        unit_price=round(current_price, 4),
    )

@router.get("/current-prices")
def get_current_prices():
    """Return current spot prices for all metals (for dashboard overview)."""
    return {
        "prices": {
            metal: arima_service.METAL_SPOT_PRICES_USD_KG[metal]
            for metal in VALID_METALS
        },
        "unit": "USD/kg",
        "source": "Market reference data",
        "timestamp": pd.Timestamp.now().isoformat()
    }

@router.get("/market-prices")
async def get_market_prices():
    """
    GET /api/forecast/market-prices
    Returns current market prices for all 7 metals with simulated micro-fluctuation
    (±0.3%) to simulate live data. Called every 5 seconds by the frontend.
    Base prices are real LME / spot prices as of May 2026.
    """
    # ── Real LME / Spot prices (May 2026) ────────────────────────────────
    # Sources:
    # Aluminium: LME 3-month ~$3,520/tonne  → $3.520/kg  (TradingEconomics, May 2026)
    # Copper:    LME 3-month ~$13,573/tonne → $13.573/kg (LME.com, May 9 2026)
    # Nickel:    LME 3-month ~$18,892/tonne → $18.892/kg (LME.com, May 9 2026)
    # Zinc:      LME 3-month ~$3,458/tonne  → $3.458/kg  (LME.com, May 8 2026)
    # Lead:      LME 3-month ~$1,975/tonne  → $1.975/kg  (LME.com, May 8 2026)
    # Silver:    Spot ~$79/troy oz → $79/0.0311034768 = ~$2,540/kg (TradingEconomics May 2026)
    # Gold:      Spot ~$4,715/troy oz → $4715/0.0311034768 = ~$151,600/kg (TradingEconomics May 2026)
    BASE_PRICES = {
        "aluminium": 3.520,
        "copper":    13.573,
        "nickel":    18.892,
        "zinc":      3.458,
        "lead":      1.975,
        "silver":    2540.0,   # USD/kg
        "gold":      151600.0, # USD/kg
    }

    METAL_LABELS = {
        "aluminium": "Aluminium",
        "copper":    "Copper",
        "nickel":    "Nickel",
        "zinc":      "Zinc",
        "lead":      "Lead",
        "silver":    "Silver (Refined)",
        "gold":      "Gold (Refined)",
    }

    # 24h change direction for each metal (based on May 2026 market context)
    # Gold: up (+0.63% on May 8), Silver: up (climbing toward $79),
    # Copper: up (+1.34%), Nickel: down (-1.31%), Aluminium: up (+0.68%),
    # Zinc: up (+1.75%), Lead: down (-0.35%)
    CHANGE_24H = {
        "aluminium": +0.68,
        "copper":    +1.34,
        "nickel":    -1.31,
        "zinc":      +1.75,
        "lead":      -0.35,
        "silver":    +2.10,
        "gold":      +0.63,
    }

    prices = []
    for metal, base in BASE_PRICES.items():
        # Apply tiny random micro-fluctuation (±0.3%) for live-data feel
        fluctuation = 1.0 + random.uniform(-0.003, 0.003)
        current     = round(base * fluctuation, 4 if base < 100 else 2)
        change_pct  = CHANGE_24H[metal] + random.uniform(-0.05, 0.05)

        # SELL_NOW vs HOLD logic:
        # SELL if 24h change is negative (price falling — sell before it drops further)
        # SELL if change is very small positive but metal is at multi-month high (gold, copper)
        # HOLD if price is on a strong upward trend
        if change_pct < 0:
            recommendation = "SELL_NOW"
        elif metal in ("gold", "copper") and change_pct > 0.5:
            # Gold and copper at near record highs — recommend SELL (peak territory)
            recommendation = "SELL_NOW"
        elif metal in ("aluminium",) and change_pct > 0.5:
            # Aluminium near 4-year high — sell while strong
            recommendation = "SELL_NOW"
        else:
            recommendation = "HOLD"

        prices.append({
            "metal":          metal,
            "label":          METAL_LABELS[metal],
            "price_usd_kg":   current,
            "change_24h_pct": round(change_pct, 2),
            "recommendation": recommendation,
            "unit":           "USD/kg",
        })

    return {"prices": prices, "updated_at": datetime.utcnow().isoformat()}
